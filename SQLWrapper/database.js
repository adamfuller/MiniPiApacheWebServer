const $ = require("../ext/jquery");
/* NOTES:
$json = file_get_contents('php://input'); gets json input for php script
*/
/* TODO:
 *  add post to php method
 *  add pull from php method
 */
class Database {
    /**
     * Create a database object for adding, updating, pulling, and deleting.
     * @param {string} dbLocation   IP or domain name hosting the SQL Server.
     * @param {string} databaseName Name of the database to connect to.
     * @param {string} user         User to login as.
     * @param {string} password     Password for the user.
     */
    constructor(dbLocation, databaseName, user, password) {
        if (!!!dbLocation || !!!databaseName || !!!user || !!!password){
            throw {
                name: "Missing Information Exception",
                message: "All input parameters must be defined"
            }
        }

        this.dbLocation = dbLocation;
        this.databaseName = databaseName;
        this.user = user;
        this.password = password;

    }

    /**
     * Url for adding to a database
     */
    static get addUrl() { return "http://www.justanotherpi.com/SQLWrapper/add.php"; }

    /**
     * Url for updating a row in the database
     */
    static get updateUrl() { return "http://www.justanotherpi.com/SQLWrapper/update.php"; }

    /**
     * Url for getting columns of a table in the database
     */
    static get columnsUrl() { return "http://www.justanotherpi.com/SQLWrapper/columns.php"; }

    /**
     * Add json data to a table in this database,
     * will be appended to the first empty row of the table.
     * ### Will throw an exception if __table__ of json is defined
     * @param {string}  table   Table to add json data to.
     * @param {JSON}    json    Data to be added.
     * 
     * @return {Boolean} returns true if successfully added.
     */
    add(table, json) {
        if (json.__table__) throw {
            name: "Table Definition Taken exception",
            message: "the '__table__' property of JSON must be null or undefined",
        };
        if (!!!table || !!!json) return false;
        json.__table__ = table;
        let str_json = JSON.stringify(json);
        let request = new XMLHttpRequest();
        request.open("POST", Database.addUrl, true);
        request.setRequestHeader("Content-type", "application/json");
        request.send(str_json);
        return true;
    }

    /**
     * Get the columns of a table in this database
     * @param {string} table Table to get the columns of.
     * 
     * @return {Array<string>} Array of columns in __table__
     */
    getColumns(table){
        var params = {
            table: table,
            database: this.databaseName,
            location: this.dbLocation,
            user: this.user,
            password: this.password,
        }

        let str_json = JSON.stringify(json);
        let request = new XMLHttpRequest();

        request.onload = (data) => {
            data.message
            ProgressEvent
        }

        request.open("GET", Database.columnsUrl, true);
        request.setRequestHeader("Content-type", "application/json");
        request.send(str_json);

    }

}
