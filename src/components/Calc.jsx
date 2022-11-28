import React, { useEffect, useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import { Box, Button, Typography } from "@mui/joy";
import ModeSwitcher from "./functions/ToggleModes";
import Grid from "@mui/material/Unstable_Grid2";

const useEnhancedEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const Calc = () => {
  const [node, setNode] = useState(null);
  const [styles, setStyles] = useState({
    fontSize: 3,
    diff: 0,
    resultBoxWidth: 0,
    parentBoxWidth: 0,
  });
  useEnhancedEffect(() => {
    setNode(document.getElementById("calc"));
    setStyles({
      ...styles,
      ...{
        resultBoxWidth: document
          .getElementById("resultBox")
          .getBoundingClientRect().width,
        parentBoxWidth: document
          .getElementById("parentBox")
          .getBoundingClientRect().width,
      },
    });
  }, []);
  const btnValues = [
    ["C", "D", "∓", "mod", "÷"],
    [7, 8, 9, "⨯"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, "00", ".", "="],
  ];

  const [controller, setController] = useState({
    sign: null,
    val: "0",
    res: "0",
    valOnHold: false,
  });

  const handleClick = (btn) => {
    switch (btn) {
      case ".":
        setController({
          ...controller,
          valOnHold: false,
          val: !controller.val.includes(".")
            ? controller.val + btn
            : controller.val,
        });
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 0:
      case "00":
        if (controller.val.length < 30) {
          setController({
            ...controller,
            valOnHold: false,
            val:
              controller.val === "0"
                ? Number(controller.val + btn).toString()
                : controller.val + btn,
          });
        }
        changeFont(1);
        break;
      case "∓":
        setController({
          ...controller,
          val:
            Number(controller.val) > 0
              ? "-" + controller.val
              : Number(controller.val) < 0
              ? controller.val.split("-")[1]
              : controller.val,
        });
        break;
      case "-":
      case "+":
      case "÷":
      case "mod":
      case "⨯":
        if (controller.sign === null) {
          setController({
            ...controller,
            ...{
              sign: btn,
              valOnHold: true,
              res: Number(controller.val).toString(),
              val: "0",
            },
          });
        } else if (controller.sign === btn && controller.valOnHold === false) {
          setController({
            ...controller,
            ...{
              res: calcRes(btn, Number(controller.res), Number(controller.val)),
              valOnHold: true,
              val: "0",
            },
          });
        } else if (controller.sign !== btn && controller.valOnHold === false) {
          setController({
            ...controller,
            ...{
              sign: btn,
              res: calcRes(
                controller.sign,
                Number(controller.res),
                Number(controller.val)
              ),
              valOnHold: true,
              val: "0",
            },
          });
        } else {
          setController({
            ...controller,
            ...{ sign: btn, valOnHold: true },
          });
        }
        changeFont(3);
        break;
      case "=":
        if (controller.sign !== null && !controller.valOnHold) {
          setController({
            ...controller,
            ...{
              sign: null,
              valOnHold: false,
              res: "0",
              val: calcRes(
                controller.sign,
                Number(controller.res),
                Number(controller.val)
              ),
            },
          });
        } else {
          setController({
            ...controller,
            ...{ sign: null, valOnHold: false, res: "0", val: controller.res },
          });
        }
        changeFont(3);
        break;
      case "C":
        setController({
          ...controller,
          ...{
            sign: null,
            valOnHold: false,
            res: "0",
            val: "0",
          },
        });
        changeFont(3);
        break;
      case "D":
        const valValue =
          controller.val.includes("Infinity") || controller.val.includes("NaN")
            ? "0"
            : controller.val.substring(0, controller.val.length - 1);
        const isValZero = valValue === "" || valValue === "-";
        if (
          isValZero &&
          controller.valOnHold === false &&
          controller.sign !== null
        ) {
          setController({
            ...controller,
            ...{
              val: "0",
              valOnHold: true,
            },
          });
          changeFont(3);
        } else if (
          isValZero &&
          controller.valOnHold &&
          controller.sign !== null
        ) {
          setController({
            val: controller.res,
            res: "0",
            sign: null,
            valOnHold: false,
          });
          changeFont(3);
        } else {
          setController({
            ...controller,
            ...{
              val: valValue !== "" && valValue !== "-" ? valValue : "0",
            },
          });
          changeFont(2);
        }
        break;
      default:
        changeFont(3);
        break;
    }
  };

  const calcRes = (mode, op1, op2) => {
    switch (mode) {
      case "-":
        return (op1 - op2).toString();
      case "+":
        return (op1 + op2).toString();
      case "÷":
        const result = (op1 / op2).toString();
        return result === "NaN" || result === "Infinity" ? "0" : result;
      case "mod":
        return (op1 % op2).toString();
      case "⨯":
        return (op1 * op2).toString();
      default:
        break;
    }
  };

  const changeFont = (mode) => {
    const rW = document
      .getElementById("resultBox")
      .getBoundingClientRect().width;
    const pW = document
      .getElementById("parentBox")
      .getBoundingClientRect().width;
    let fsChange, fs;
    const change = 0.3;
    switch (mode) {
      case 1:
        fs = styles.fontSize - styles.diff - change > 0.6;
        fsChange = pW - rW < 70;
        setStyles({
          ...styles,
          ...{
            resultBoxWidth: rW,
            parentBoxWidth: pW,
            diff: fsChange
              ? fs
                ? styles.diff + change
                : styles.diff
              : styles.diff,
          },
        });
        break;
      case 2:
        fs = styles.fontSize - styles.diff + change < 3;
        fsChange = pW - rW > 70;
        setStyles({
          ...styles,
          ...{
            resultBoxWidth: rW,
            parentBoxWidth: pW,
            diff: fsChange
              ? fs
                ? styles.diff - change
                : styles.diff
              : styles.diff,
          },
        });
        break;
      case 3:
        setStyles({
          fontSize: 3,
          diff: 0,
          resultBoxWidth: rW,
          parentBoxWidth: pW,
        });
        break;
      default:
        break;
    }
  };

  const handleUserKeyPress = (e) => {
    e.preventDefault();
    const { key } = e;
    switch (key) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        handleClick(Number(key));
        break;
      case ".":
      case "+":
      case "-":
      case "=":
        handleClick(key);
        break;
      case "Enter":
        handleClick("=");
        break;
      case "*":
        handleClick("⨯");
        break;
      case "/":
        handleClick("÷");
        break;
      case "%":
        handleClick("mod");
        break;
      case "Backspace":
        handleClick("D");
        break;
      case "Delete":
        handleClick("C");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  });
  return (
    <CssVarsProvider
      colorSchemeNode={node || null}
      colorSchemeSelector="#calc"
      modeStorageKey="calc-calc"
    >
      <Box
        id="calc"
        sx={{
          textAlign: "center",
          flexGrow: 1,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          bgcolor: "background.body",
          boxSizing: "border-box",
          p: 2,
          overflowY: "scroll",
        }}
      >
        <ModeSwitcher />
        <Box>
          <Grid container spacing={1}>
            <Grid xs={12}>
              <Typography
                component="div"
                sx={{
                  height: "2rem",
                  textAlign: "end",
                  padding: "1rem",
                  opacity: ".65",
                }}
              >
                {controller.sign
                  ? `${controller.res} ${controller.sign} ${
                      controller.valOnHold
                        ? ""
                        : controller.val +
                          " = " +
                          calcRes(
                            controller.sign,
                            Number(controller.res),
                            Number(controller.val)
                          )
                    }`
                  : ""}
              </Typography>
              <Typography
                component="div"
                sx={{
                  height: "7rem",
                  textAlign: "end",
                  padding: "1rem",
                }}
                id="parentBox"
              >
                <span
                  id="resultBox"
                  style={{ fontSize: `${styles.fontSize - styles.diff}rem` }}
                >
                  {controller.valOnHold ? "" : controller.val}
                </span>
              </Typography>
            </Grid>
            {btnValues.flat().map((btn, i) => {
              return (
                <Grid
                  xs={btn === "C" || btn === "D" || btn === "∓" ? 2 : 3}
                  sx={{ height: "5rem" }}
                  key={`button-${btn}`}
                >
                  <Button
                    fullWidth
                    onClick={() => handleClick(btn)}
                    variant={`${btn}`.match(/^[-+÷⨯=]$/) ? "solid" : "outlined"}
                    color={`${btn}`.match(/^[-+÷⨯]$/) ? "primary" : "neutral"}
                    sx={{ height: "100%", fontSize: "1.5rem" }}
                  >
                    {btn}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default Calc;
