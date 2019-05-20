# Struktura bazy

## `CREATE TABLE`

```sql
CREATE TABLE `env_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `household_id` int(11) NOT NULL,
  `value` json DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` enum('temperature','humidity','movement') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `env_records_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1745 DEFAULT CHARSET=utf8;

CREATE TABLE `fixed_monthly_expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `household_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `cost` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `fixed_monthly_expenses_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

CREATE TABLE `households` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` enum('info','warning','error') NOT NULL,
  `read` tinyint(1) NOT NULL,
  `data` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

CREATE TABLE `permission_role` (
  `permission_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `permission_role_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `permission_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

CREATE TABLE `shopping_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `household_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `shared` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `shopping_categories_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

CREATE TABLE `shopping_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shopping_shop_id` int(11) NOT NULL,
  `shopping_category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `household_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `discount_on_unit` decimal(8,2) NOT NULL,
  `quantity` decimal(8,3) NOT NULL,
  `shared` tinyint(1) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  KEY `shopping_shop_id` (`shopping_shop_id`),
  KEY `shopping_category_id` (`shopping_category_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `shopping_items_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shopping_items_ibfk_2` FOREIGN KEY (`shopping_shop_id`) REFERENCES `shopping_shops` (`id`),
  CONSTRAINT `shopping_items_ibfk_3` FOREIGN KEY (`shopping_category_id`) REFERENCES `shopping_categories` (`id`),
  CONSTRAINT `shopping_items_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1290 DEFAULT CHARSET=utf8;

CREATE TABLE `shopping_list_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shopping_list_id` int(11) NOT NULL,
  `shopping_sublist_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` decimal(8,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shopping_list_id` (`shopping_list_id`),
  KEY `shopping_sublist_id` (`shopping_sublist_id`),
  CONSTRAINT `shopping_list_items_ibfk_1` FOREIGN KEY (`shopping_list_id`) REFERENCES `shopping_lists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shopping_list_items_ibfk_2` FOREIGN KEY (`shopping_sublist_id`) REFERENCES `shopping_sublists` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `shopping_lists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `household_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `shopping_lists_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

CREATE TABLE `shopping_shops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `household_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `shopping_shops_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8;

CREATE TABLE `shopping_sublists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shopping_list_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shopping_list_id` (`shopping_list_id`),
  CONSTRAINT `shopping_sublists_ibfk_1` FOREIGN KEY (`shopping_list_id`) REFERENCES `shopping_lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_permission` (
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `user_permission_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permission_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `household_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `color` varchar(7) NOT NULL,
  `birthdate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;

CREATE TABLE `utility_costs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `household_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `cost` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `utility_costs_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

CREATE TABLE `utility_usage_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utility_cost_id` int(11) NOT NULL,
  `value` json DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `utility_cost_id` (`utility_cost_id`),
  CONSTRAINT `utility_usage_records_ibfk_2` FOREIGN KEY (`utility_cost_id`) REFERENCES `utility_costs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8;
```

## `CREATE PROCEDURE`
```sql
CREATE PROCEDURE `shoppingExpences_hh_from_to`(in _household_name varchar(255), in _from varchar(10), in _to varchar(10)) begin
    select
        _household_name as "Nazwa", 
        sum(shopping_items.quantity * shopping_items.price - shopping_items.quantity * shopping_items.discount_on_unit) as "Koszt całkowity"
        from shopping_items 
        join households 
            on households.id = shopping_items.household_id 
        where 
            households.name = _household_name and
            shopping_items.date between _from and _to;
end ;;

-- +4 more

CREATE PROCEDURE `insertNotification_hh`(in _household_id int(11), in _type enum('info','warning', 'error'), in _value json) begin
    declare done int default false; 
    declare _user_id int(11); 
    declare cur1 cursor for select id from users where household_id=_household_id; 
    declare continue handler for not found set done = true; 
    
    open cur1;  
    insert_loop: LOOP 
        fetch cur1 into _user_id;
        if done then leave insert_loop;
        else 
            insert into notifications (user_id, type, `read`, data, created_at) values (_user_id, _type, false,_value, current_timestamp);
        end if;
    end loop;
    close cur1;
end ;;
```

## `CREATE TRIGGER`

```sql
CREATE TRIGGER tooHot after insert on env_records
for each row begin
    declare room_array json;
    declare i int default 0;
    if new.type="temperature" then 
        select json_keys(new.value) into room_array; 
        while_loop: while i<json_length(room_array) do
            if json_extract(new.value, concat("$.",json_extract(room_array,concat("$[",i,"]")))) > 40 then
                call insertNotification_hh(new.household_id,'error','{"msg": "Temperatura osiągnęła niebezpiecznie wysoką wartość!"}');
                leave while_loop;
            end if;
            select i+1 into i;
        end while while_loop;
    end if;
end ;;

-- +3 more
```
