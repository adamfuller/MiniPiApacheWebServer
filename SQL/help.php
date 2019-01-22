<?php
    echo "url: select url/location/ip of the sql database<br>";
    echo "user: select user for administering changes<br>";
    echo "password: user's password<br>";
    echo "table: select table to modify<br>";

    echo "Specifics:<br>";

    echo "create.php:<br>";
    echo "specs: enter the title and datatype of the columns without parenthesis, example:<br>";
    echo "textColumnName TEXT, numberColumnName NUMERIC, bitMask TINYINT<br>";
    echo "Above would create a three column table with a text column, number column, and a byte column<br>";

    echo "delete.php<br>";
    echo "where: the boolean for if the row is deleted, example:<br>";
    echo "numberColumnName = 2<br>";
    echo "Above would delete each row where the numberColumnName was equal to 2<br>";

    echo "insert.php<br>";
    echo "columns: the names of the columns of the table, example:<br>";
    echo "textColumnName, numberColumnName, bitMask<br>";

    echo "values: the values of the respective columns of the table, example:<br>";
    echo "'some text', 9, 2<br>";
    echo "The above columns and values would update the textColumnName column to 'some text', the numberColumnName to 9, and the bitMask to 2<br>";


    echo "update.php<br>";
    echo "set: the set portion of the SQL command, example:<br>";
    echo "someColumn = 9<br>";
    echo "The above sets the value of someColumn to 9<br>";

    echo "where: the (optional) where portion of the SQL command, example:<br>";
    echo "bitMask & 1 > 0<br>";
    echo "The above would only change rows where the bitMask value has a 1 in the 0th bit<br>";
    echo "If left out changes will be made to all rows<br>";

?>  