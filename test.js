const insert = ({tableName, colNames}) => {
  return `INSERT INTO ${tableName} ${colNames}
    VALUES (${"?,".repeat(colNames.length -1)}?)`;
}

console.log(insert({tableName: "tableName", colNames: ["col1", "col2"]}));
