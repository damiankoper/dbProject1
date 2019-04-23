const mysql = require('mysql2')
const moment = require('moment')
const faker = require('faker')
const Color = require('color')
faker.locale = 'pl'
require('dotenv').config()
moment.defaultFormat = "YYYY-MM-DD HH:mm:ss"

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const connection = mysql.createConnection({
  host: '80.211.177.236',
  user: 'seeder',
  database: 'hhapp',
  password: process.env.DB_PASS
});

/**
 * Seed env_records
 */
/* [1, 2, 3, 4].forEach(hh => {
  ['temperature', 'humidity', 'movement'].forEach(type => {
    for (let date = moment(); date.isBefore(moment().add(3, 'days')); date.add(30, 'minutes')) {
      let data;
      switch (type) {
        case 'temperature':
          data = {
            room_1: getRandomArbitrary(18, 26),
            room_2: getRandomArbitrary(18, 26),
            room_3: getRandomArbitrary(18, 26),
            room_4: getRandomArbitrary(18, 26)
          }
          break;
        case 'humidity':
        data = {
          room_1: getRandomArbitrary(40, 100),
          room_2: getRandomArbitrary(40, 100),
          room_3: getRandomArbitrary(40, 100),
          room_4: getRandomArbitrary(40, 100)
        }
          break;
        case 'movement':
        data = {
          room_1: Math.round((Math.random() * 1) + 0) === 0,
          room_2: Math.round((Math.random() * 1) + 0) === 0,
          room_3: Math.round((Math.random() * 1) + 0) === 0,
          room_4: Math.round((Math.random() * 1) + 0) === 0
        }
          break;
      }
      connection.query(
        'INSERT INTO env_records (household_id, value, type, date) values(?,?,?,?)', [hh, JSON.stringify(data), type, date.format()])
    }
  })
})
 */
/**
 * Seed env_records
 */
/* [1, 2, 3, 4, 5, 6].forEach(hh => {
  let value = {gauge_1: 1200}
  for (let date = moment(); date.isBefore(moment().add(3, 'days')); date.add(3, 'hours')) {
    value.gauge_1+=getRandomArbitrary(10, 50);
    connection.query(
      'INSERT INTO utility_usage_records (utility_cost_id, value, date) values(?,?,?)', [hh, JSON.stringify(value), date.format()])
  }
})
 */

/**
 * Seed users
 */
/* let hh = 0;
for (let i = 0; i < 10; i++) {
  connection.query(
    'INSERT INTO users (household_id, firstname, surname, color, birthdate) values(?,?,?,?,?)',
    [
      hh++ % 4 + 1,
      faker.name.firstName(),
      faker.name.lastName(),
      faker.internet.color(),
      moment(faker.date.between("1970-01-01", "2000-01-01")).format()
    ], (err, res) => {
      for (let p = 1; p <= 8; p++)
        connection.query(
          'INSERT INTO user_permission values(?,?)',
          [
            res.insertId, p
          ])
    })
}
 */

/**
 * Seed products
 */

connection.query('select id from users', [], (err, userID) => {
  userID = userID.map(id => id.id)
  connection.query('select id from shopping_categories', [], (err, categoryID) => {
    categoryID = categoryID.map(id => id.id)
    connection.query('select id from shopping_shops', [], (err, shopID) => {
      shopID = shopID.map(id => id.id)
      Array(1000).fill(0).forEach(() => {
        connection.query(
          `INSERT INTO shopping_items (household_id, user_id, shopping_category_id, shopping_shop_id, 
         name, price, discount_on_unit, quantity, shared, date) values(?,?,?,?,?,?,?,?,?,?)`,
          [
            getRandomArbitrary(1, 4),
            userID[parseInt(getRandomArbitrary(0, userID.length - 1))],
            categoryID[parseInt(getRandomArbitrary(0, categoryID.length - 1))],
            shopID[parseInt(getRandomArbitrary(0, shopID.length - 1))],
            faker.commerce.productName(),
            faker.commerce.price(),
            0,
            parseInt(getRandomArbitrary(1, 10)),
            Math.round((Math.random() * 1) + 0) === 0,
            moment(faker.date.between(moment().subtract(3, 'months'), moment())).format()
          ])
      })
    })
  })
})