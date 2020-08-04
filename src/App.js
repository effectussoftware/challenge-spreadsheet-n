import React, { useEffect, useState } from "react";

import {
  createSpreadsheet,
  getColumnLabel,
  getCellValue,
  ERROR,
  isNumber,
  isCell,
  startsWithOperator,
  isFunction,
} from "./utils";
import "./App.css";

function App() {
  const [spreadsheet, setSpreadsheet] = useState([]);

  useEffect(() => {
    setSpreadsheet(createSpreadsheet(50));
  }, []);

  const validateParameter = (parameter, matrix) => {
    if (isNumber.test(parameter)) {
      return parseInt(parameter);
    } else if (isCell.test(parameter)) {
      const cellValue = getCellValue(parameter, matrix);
      if (isNumber.test(cellValue)) {
        return parseInt(cellValue);
      } else return ERROR;
    }
    return ERROR;
  };

  // Returns calculated value
  const getValue = (value, matrix) => {
    let newValue = value;

    if (isFunction.test(newValue)) {
      let expression = value.slice(1);
      if (startsWithOperator.test(expression)) {
        expression = `0${expression}`;
      }
      const additionParams = expression.split("+");
      const substactionParams = additionParams.map((param) => param.split("-"));
      if (substactionParams.length === 1 && substactionParams[0].length === 1) {
        const param = newValue.slice(1);
        if (isNumber.test(param)) {
          return param;
        } else if (isCell.test(param)) {
          return getCellValue(param, matrix);
        } else return "INVALID ENTRY";
      } else {
        const parameters = substactionParams.map((parameter) => {
          if (parameter.length === 1) {
            return validateParameter(parameter[0], matrix);
          } else {
            let substraction = validateParameter(parameter[0], matrix);

            if (substraction !== "INVALID ENTRY") {
              for (let p = 1; p < parameter.length; p++) {
                const value = validateParameter(parameter[p], matrix);
                if (value === "INVALID ENTRY") {
                  return "INVALID ENTRY";
                } else {
                  substraction = substraction - value;
                }
              }
            }
            return substraction;
          }
        });
        if (!parameters.find((p) => p === "INVALID ENTRY")) {
          newValue = parameters[0];
          for (let p = 1; p < parameters.length; p++) {
            newValue = newValue + parameters[p];
          }
        } else return "INVALID ENTRY";
      }
      return newValue;
    }
    return newValue;
  };

  const changeCellValue = (row, col) => {
    const newSpreadsheet = [...spreadsheet];
    newSpreadsheet[row][col] = {
      func: spreadsheet[row][col].func,
      value: getValue(spreadsheet[row][col].func, spreadsheet),
    };
    let changingCells = [];
    const updatedSpreadsheet = newSpreadsheet.map((r, rInd) => {
      return r.map((c, cInd) => {
        if (rInd === row && cInd === col) {
          return { ...c };
        }
        const updatedValue = getValue(c.func, newSpreadsheet);
        if (updatedValue !== c.value) {
          changingCells.push({ r: rInd, c: cInd });
        }
        return { func: c.func, value: updatedValue };
      });
    });
    setSpreadsheet(updatedSpreadsheet);
    changingCells.forEach(({ r, c }) => changeCellValue(r, c));
  };

  const handleInputChange = (e, row, col) => {
    const newSpreadsheet = [...spreadsheet];
    newSpreadsheet[row][col] = {
      func: e.target.value,
      value: e.target.value,
    };
    setSpreadsheet(newSpreadsheet);
  };

  const showFuncValue = (row, col) => {
    const newSpreadsheet = [...spreadsheet];
    newSpreadsheet[row][col] = {
      ...newSpreadsheet[row][col],
      value: spreadsheet[row][col].func,
    };
    setSpreadsheet(newSpreadsheet);
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      document.activeElement.blur();
    }
  };
  return (
    <table cellSpacing="0" cellPadding="0">
      <tbody>
        {spreadsheet.map((row, rowIndex) => {
          if (rowIndex === 0) {
            return (
              <tr key={`row-${rowIndex}`}>
                {row.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return (
                      <td
                        key={getColumnLabel(columnIndex - 1)}
                        style={{ margin: 0 }}
                      />
                    );
                  }
                  return (
                    <td
                      key={getColumnLabel(columnIndex - 1)}
                      className="column-name"
                    >
                      {getColumnLabel(columnIndex - 1)}
                    </td>
                  );
                })}
              </tr>
            );
          }
          return (
            <tr key={`row-${rowIndex}`}>
              <td className="row-name">{rowIndex}</td>
              {row.map((column, columnIndex) => {
                if (columnIndex !== 0) {
                  return (
                    <td
                      key={`${getColumnLabel(columnIndex - 1)} ${rowIndex}`}
                      className="cell"
                    >
                      <input
                        value={spreadsheet[rowIndex][columnIndex].value}
                        className="input"
                        onBlur={(e) => changeCellValue(rowIndex, columnIndex)}
                        onFocus={(e) => showFuncValue(rowIndex, columnIndex)}
                        onKeyDown={(e) => handleEnterPress(e)}
                        onChange={(e) =>
                          handleInputChange(e, rowIndex, columnIndex)
                        }
                      />
                    </td>
                  );
                }
                return null;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default App;
