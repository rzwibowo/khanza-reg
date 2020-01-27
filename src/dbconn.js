require('dotenv').config()

const mysql = require('mysql')

class dbUtil {
    connection = mysql.createConnection({
        host: process.env.DB_SERVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dateStrings: true
    })

    doQuery(q, cb) {
        let result

        this.connection.connect(err => {
            if (err) {
                console.error(err.code)
                console.error(err.fatal)
            }
        })
        this.connection.query(q, (err, rows, fields) => {
            if (err) {
                console.error('Terjadi kesalahan')
                console.error(err)
                return
            }
            cb(JSON.stringify(rows))
        })
        this.connection.end(() => { })
    }
}

export { dbUtil }