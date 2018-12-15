const fs = require('fs')
const db = require('./db-config')
const faker = require('faker')
const uuidv4 = require('uuid/v4')

const initPlace = [
    { country: 'Netherlands', city: 'Amsterdam' },
    { country: 'France', city: 'Paris' },
    { country: 'Spain', city: 'Barcelona' },
    { country: 'Germany', city: 'Berlin' },
    { country: 'England', city: 'London' },
    { country: 'Sweden', city: 'Stockholm' },
    { country: 'Italy', city: 'Rome' },
    { country: 'Turkey', city: 'Istanbol' },
    { country: 'U.S.A', city: 'Washington' },
    { country: 'Switzerland', city: 'Geneva' }
]

if (!fs.existsSync('houses-data.json')) {
    fs.appendFile('houses-data.json', '[]', error => console.log(error))
}

// generate one house object
function houseGenerate() {
    const randomCountry = initPlace[Math.floor(Math.random() * initPlace.length)] // choose one city with one country 
    const fakeCountry = randomCountry.country
    const fakeCity = randomCountry.city
    const fakeLink = faker.internet.url() + '?id=' + uuidv4()
    const recentDate = faker.date.recent()
    const fakeDate = faker.date.between('2017-01-01', recentDate) // to generate a date between 01/01/2017 and now

    const fakeAddress = faker.address.streetAddress()
    const fakeLat = faker.address.latitude()
    const fakeLon = faker.address.longitude()
    const fakeLivingArea = faker.random.number({
        min: 90,
        max: 1000
    })
    const fakeRooms = faker.random.number({
        min: 2,
        max: 10
    })
    const fakePriceValue = faker.finance.amount()
    const fakePriceCurr = faker.finance.currencyCode() // finance : from faker documentation
    const fakeDescription = faker.lorem.text() // lorem : from faker documentation
    const fakeTitle = faker.name.title()

    const imgArrLength = faker.random.number({
        min: 1,
        max: 11
    })
    let fakeImages = []
    for (let i = 0; i < imgArrLength; i++) {
        fakeImages.push(faker.image.imageUrl() + '.jpg')
    }
    return {
        link: fakeLink,
        market_date: fakeDate,
        location: {
            country: fakeCountry,
            city: fakeCity,
            address: fakeAddress,
            coordinates: {
                lat: fakeLat,
                lng: fakeLon
            }
        },
        size: {
            gross_m2: fakeLivingArea,
            rooms: fakeRooms
        },
        price: {
            value: fakePriceValue,
            currency: fakePriceCurr
        },
        description: fakeDescription,
        title: fakeTitle,
        images: fakeImages
    }
}

// generate an amount of houses
function generateListOfhouses(length) {
    let houses = []
    for (let i = 0; i < length; i++) {
        houses.push(houseGenerate())
    }

    return houses
}

const houses = generateListOfhouses(200)

fs.writeFile('./houses-data.json', JSON.stringify(houses), error => {
    if (error) console.log(error)
    else console.log('Done!')
})

let storeHousesQuery =
    'INSERT INTO houses (link, market_date, location_country, location_city, location_address, location_coordinates_lat,'
storeHousesQuery +=
    ' location_coordinates_lng, size_grossm2, size_rooms, price_value, price_currency, description,'
storeHousesQuery += 'title, images) VALUES ?'
let qurArr = []

houses.forEach((house, i) => {
    const {
        link,
        market_date,
        location,
        size,
        price,
        images,
        description,
        title
    } = house
    const priceValue = isNaN(price.value) ? 0 : price.value
    const strImg = images.join()

    qurArr[i] = [
        link,
        market_date,
        location.country,
        location.city,
        location.address,
        location.coordinates.lat,
        location.coordinates.lng,
        size.gross_m2,
        size.rooms,
        priceValue,
        price.currency,
        description,
        title,
        strImg
    ]
})

db.query(storeHousesQuery, [qurArr], (err, results, fields) => {
    if (err) console.log('error with inserting data!', err)
    else console.log('Data inserted!')
})