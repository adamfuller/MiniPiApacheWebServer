<?php
    echo "url: select url/location/ip of the sql database";
    echo "user: select user for administering changes";
    echo "password: user's password";
    echo "table: select table to modify";

    echo "Specifics:";

    echo "create.php:";
    echo "specs: enter the title and datatype of the columns without parenthesis, example:";
    echo "textColumnName TEXT, numberColumnName NUMERIC, bitMask TINYINT";
    echo "Above would create a three column table with a text column, number column, and a byte column";

    echo "delete.php";
    echo "where: the boolean for if the row is deleted, example:";
    echo "numberColumnName = 2";
    echo "Above would delete each row where the numberColumnName was equal to 2";

    echo "insert.php";
    echo "columns: the names of the columns of the table, example:";
    echo "textColumnName, numberColumnName, bitMask";

    echo "values: the values of the respective columns of the table, example:";
    echo "'some text', 9, 2";
    echo "The above columns and values would update the textColumnName column to 'some text', the numberColumnName to 9, and the bitMask to 2";


    echo "update.php";
    echo "set: the set portion of the SQL command, example:";
    echo "someColumn = 9";
    echo "The above sets the value of someColumn to 9";

    echo "where: the (optional) where portion of the SQL command, example:";
    echo "bitMask & 1 > 0";
    echo "The above would only change rows where the bitMask value has a 1 in the 0th bit";
    echo "If left out changes will be made to all rows";

?>  