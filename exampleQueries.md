# Przykładowe zapytania - Household App
## Wykorzystanie widoków
```sql
SELECT * FROM shopping_items_view;
SELECT * FROM env_records_temperature;
SELECT * FROM env_records_humidity;
SELECT * FROM env_records_movement;
```

## Procedury składowe
```sql
CALL showShoppingItemsOfFromTo("dom_2", '2019-01-01', '2019-04-03');
CALL avgTemp_hh_room("dom_3", "room_2");
CALL avgHum_hh_room("dom_3", "room_2");
CALL shoppingExpences_hh_from_to('dom_3', '2019-03-15', '2019-03-21');
CALL showPermissions_userId('50');
CALL insertNotification_hh(1,'info','{}');
```

## Wywołanie wyzwalaczy
```sql
-- toExpensive
INSERT INTO shopping_items (
    shopping_shop_id,
    shopping_category_id, 
    user_id, 
    household_id,
    name, 
    price, 
    discount_on_unit, 
    quantity, 
    shared, 
    date
)
VALUES (1, 1, 43, 2, "Coś drogiego", 1100, 0, 1 , false, now());

-- toHot
INSERT INTO env_records (
    household_id, 
    type,
    value
) 
VALUES (1, 'temperature', 
    '{
        "room_1": 18.267568418382893,
        "room_2": 19.08522642714848,
        "room_3": 41.4250575944651,
        "room_4": 18.718427486881644
    }'
);

-- tooHumid
INSERT INTO env_records (
    household_id,
    type, 
    value
) 
VALUES (1, 'humidity', 
    '{
        "room_1": 97.22885434447494, 
        "room_2": 91.53714377798264, 
        "room_3": 52.6151348179647, 
        "room_4": 95.76761420075096
    }'
);

-- newShoppingList
INSERT INTO shopping_lists (
    household_id,
    name
)
VALUES (
    1,
    'Lista 1'
);
```

## Inne

### Statystyki list zakupów:
```sql
SELECT 
    households.name AS "Nazwa gospodarstwa"
    shopping_lists.name AS "Nazwa listy", 
    COUNT(1) AS "Ilość produktów na liście" 
FROM shopping_lists 
RIGHT JOIN shopping_list_items 
    ON shopping_lists.id = shopping_list_items.shopping_list_id
JOIN households
    ON shopping_lists.household_id = households.id
GROUP BY
    shopping_lists.name,
    households.name;
```

### Statystyki ogólne dla gospodarstwa:
```sql
SET @_from = '2019-01-01';
SET @_to = '2019-05-01';

SELECT 
    households.name AS "Nazwa gospodarstwa", 
    COUNT(DISTINCT users.id) as "Użytkownicy", 
    COUNT(DISTINCT shopping_lists.id) AS "Listy zakupów", 
    COUNT(DISTINCT shopping_items.id) AS "Wprowadzone produkty", 
    ROUND(
        SUM(
            shopping_items.price*shopping_items.quantity - shopping_items.discount_on_unit * shopping_items.quantity),
        2) AS "Wartość zakupów" 
FROM households 
LEFT JOIN users 
    ON users.household_id = households.id
LEFT  JOIN shopping_items 
    ON shopping_items.household_id = households.id 
LEFT JOIN shopping_lists 
    ON shopping_lists.household_id = households.id 
WHERE shopping_items.date BETWEEN @_from AND @_to 
GROUP BY households.name;
```