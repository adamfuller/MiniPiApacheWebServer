// package SQLWrapper;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

class Database {
    final static String addUrl = "http://www.justanotherpi.com/SQLWrapper/add.php";
    final static String updateUrl = "http://www.justanotherpi.com/SQLWrapper/update.php";
    final static String columnsUrl = "http://www.justanotherpi.com/SQLWrapper/columns.php";
    final static String pullUrl = "http://www.justanotherpi.com/SQL/pull.php";

    private String dbLocation, databaseName, user, password, table;

    public Database() {
    }

    public Database(String dbLocation, String databaseName, String user, String password) {
        this(dbLocation, databaseName, user, password, null);
    }

    public Database(String dbLocation, String databaseName, String user, String password, String table) {
        this.dbLocation = dbLocation;
        this.databaseName = databaseName;
        this.user = user;
        this.password = password;
        this.table = table;
    }

    //#region Setters

    public void setDatabaseName(String newDatabaseName){
        this.databaseName = newDatabaseName;
    }

    public void setDatabaseLocation(String newDatabaseLocation){
        this.dbLocation = newDatabaseLocation;
    }

    public void setUser(String newUser){
        this.user = newUser;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public void setTable(String table){
        this.table = table;
    }

    //#endregion Setters
    
    //#region Functions that abstract the database interaction

    public String add(Map<String, Object> data) throws Exception {
        if (this.table == null ) {
            throw new Exception("No Table Present Exception");
        }
        return this.add(this.table, data);
    }

    public String add(String table, Map<String, Object> data) throws Exception {
        data.put("table", table);
        data.put("database", this.databaseName);
        data.put("location", this.dbLocation);
        data.put("user", this.user);
        data.put("password", this.password);

        return this.sendGet(Database.addUrl, data);
    }

    public String update(Map<String, Object> data) throws Exception {
        if (this.table == null ) {
            throw new Exception("No Table Present Exception");
        }
        return this.update(this.table, data);
    }

    public String update(String table, Map<String, Object> data) throws Exception {
        data.put("table", table);
        data.put("database", this.databaseName);
        data.put("location", this.dbLocation);
        data.put("user", this.user);
        data.put("password", this.password);
        return this.sendGet(Database.updateUrl, data);
    }

    public String getColumns() throws Exception {
        if (this.table == null ) {
            throw new Exception("No Table Present Exception");
        }
        return this.getColumns(this.table);
    }

    public String getColumns(String table) throws Exception {

        Map<String, Object> data = new HashMap<>();

        data.put("table", table);
        data.put("database", this.databaseName);
        data.put("location", this.dbLocation);
        data.put("user", this.user);
        data.put("password", this.password);

        return sendGet(Database.columnsUrl, data);

    }

    /**
     * Pulls the entire content of the current table
     * @return json string representing the contents of the table
     * @throws Exception
     */
    public String pullTable() throws Exception{
        return this.pullTable(this.table);
    }

    public String pullTable(String table) throws Exception {

        Map<String, Object> data = new HashMap<>();

        data.put("table", table);
        data.put("database", this.databaseName);
        data.put("location", this.dbLocation);
        data.put("user", this.user);
        data.put("password", this.password);

        return sendGet(Database.pullUrl, data);

    }

    //#endregion Functions that abstract the database interaction

    //#region Tools 

    private String mapToString(Map<String, Object> map) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("{");
        map.forEach((key, value) -> {

            stringBuilder.append("\"");
            stringBuilder.append(key);
            stringBuilder.append("\"");
            stringBuilder.append(":");

            if (value instanceof Map<?, ?>) {
                stringBuilder.append(mapToString((Map<String, Object>) value));
            } else if (value instanceof LocalDateTime) {
                stringBuilder.append("\"");
                stringBuilder
                        .append(((LocalDateTime) value).format(DateTimeFormatter.ofPattern("YYYY-MM-dd hh:mm:ss")));
                stringBuilder.append("\"");
            } else if (value instanceof String) {
                stringBuilder.append("\"");
                stringBuilder.append(value);
                stringBuilder.append("\"");
            } else {
                stringBuilder.append("\"");
                stringBuilder.append(value.toString());
                stringBuilder.append("\"");
            }
            stringBuilder.append(",");
        });
        stringBuilder.delete(stringBuilder.length()-1, stringBuilder.length());
        stringBuilder.append("}");
        return stringBuilder.toString();
    }

    //#endregion Tools

    //#region Functions that operate over the internet
    private String sendGet(String url, Map<String, Object> data) throws Exception {

        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // Optional default is GET
        con.setRequestMethod("GET");

        // Add request header
        con.setRequestProperty("User-Agent", "Mozilla/5.0");
        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

        // Tell the server to accept a JSON object
        con.setRequestProperty("Accept", "application/json");
        con.setRequestProperty("Content-Type", "application/json; utf-8");

        String jsonInputString = mapToString(data);

        boolean sent = sendString(jsonInputString, con);

        int responseCode = con.getResponseCode();
        // System.out.println("\nSending 'GET' request to URL : " + Database.addUrl);
        System.out.println("Response Code : " + responseCode);

        String response;

        try {
            response = getStringFromInputStream(con.getInputStream());
        } catch (Exception e) {
            response = null;
        }

        return response;
    }

    private boolean sendString(String string, HttpURLConnection con) {
        con.setDoOutput(true);
        try (OutputStream os = con.getOutputStream()) {
            byte[] input = string.getBytes("utf-8");
            os.write(input, 0, input.length);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    private String getStringFromInputStream(InputStream stream) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(stream));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        return response.toString();

    }

    //#endregion Functions that operate over the internet

    public static void main(String[] args) {
        //
        // DON'T FORGET TO CHANGE THE PASSWORD
        //
        String password = "FAKE_PASSWORD";
        Database database = new Database(
            "localhost",
            "test0",
            "admin",
            password,
            "testTable0"
        );

        try{
            System.out.println(database.getPull(database.table));
        }catch(Exception e){

        }

    }
}