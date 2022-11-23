import React, { useEffect, useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import { Box, Button, Typography } from "@mui/joy";
import ModeSwitcher from "./functions/ToggleModes";
import Grid from "@mui/material/Unstable_Grid2";

const useEnhancedEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const Calc = () => {
  const [node, setNode] = useState(null);
  useEnhancedEffect(() => {
    setNode(document.getElementById("calc"));
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
            ...{ sign: null, valOnHold: false, res: "0" },
          });
        }
        break;
      case "C":
        setController({
          ...controller,
          ...{ sign: null, valOnHold: false, res: "0", val: "0" },
        });
        break;
      case "D":
        const result = calcRes("÷", Number(controller.val), 10);
        setController({
          ...controller,
          ...{
            val:
              result > 1 || result < -1
                ? controller.val.substring(0, controller.val.length - 1)
                : "0",
            valOnHold: controller.sign
              ? result > 1 || result < -1
                ? false
                : true
              : false,
          },
        });
        break;
      default:
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
        return op2 !== 0 ? (op1 / op2).toString() : "0";
      case "mod":
        return (op1 % op2).toString();
      case "⨯":
        return (op1 * op2).toString();
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
                }}
              >
                {controller.sign
                  ? `${controller.res} ${controller.sign} ${controller.val}`
                  : ""}
              </Typography>
              <Typography
                component="div"
                sx={{
                  height: "7rem",
                  textAlign: "end",
                  padding: "1rem",
                  fontSize: "2.5rem",
                  wordWrap: "break-word",
                }}
              >
                {controller.valOnHold ? "__" : controller.val}
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
