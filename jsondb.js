const fs = require('fs')

// utils
const db = () => fs.readFileSync('./data/db.json')
const parse = string => JSON.parse(string)
const stringify = string => JSON.stringify(string, null, 2)
const save = data => fs.writeFileSync(__dirname + '/data/db.json', data)

const jsondb = {
    async find(id){
        const Users = parse(db())
        return Users.find(user => user.id == id || user.email == id)
    },
    async update(id, newValues){
        const Users = parse(db())
        const userIndex = Users.findIndex(user => user.id == id)
        
        const newUser = {
            ...Users[userIndex],
            ...newValues
        }

        Users[userIndex] = newUser

        const stringJson = stringify(Users)

        save(stringJson)

        return Users[userIndex]
    },
    delete(id){
        const Users = parse(db())
        
        const usersWithoutId = Users.filter(user => user.id != id)

        const stringJson = stringify(usersWithoutId)

        save(stringJson)
    
        return true
    },
    create(user){
        const Users = parse(db())

        const toSave = {
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
            ...user
        }

        Users.push(toSave)

        save(stringify(Users))

        return toSave
    },
}

module.exports = jsondb
