/*
  CHALLENGE:

  FORK this Pen. 

  Finish the "mustache" function so that the console output should be something like:
  { duration: X,
    result: "A:Alpha, Y:xY, B:xB1 and xB2, Z:xZ C:xC1, xC2, xF1 and xF2 D:Delta."
    answeredCorrectly: true }

  When you're done, send in this CodePen to continue the process.

  You'll be evaluated on code quality and performance
*/

async function getData(key) {
  switch (key) {
    case "A":
      return "Alpha";
    case "BB":
      return "{{B1}} and {{B2}}";
    case "C":
      return "{{C1}}, {{C2}}, {{EE}}";
    case "DD":
      return "Delta";
    case "EE":
      return "{{F1}} and {{F2}}";
  }
  await new Promise(r => {
    setTimeout(r, 1000);
  });
  return `x${key}`;
}

async function mustache(input, callback) {
  // TODO: FINISH THIS FUNCTION
  const auxiliary = async source => {
    const replaceValueInBrackets = async val => {
      if (val.search("{") >= 0) {
        const matched = val.match(/(?<={{).+?(?=}})/);
        const getData = await callback(...matched);
        return val.replace(/{.*/, getData);
      } else {
        return val;
      }
    };

    const isAndInString = async str => {
      if (str.search("and") >= 0) {
        const arr = str.split(" ");
        const result = await Promise.all(
          arr.map(val => replaceValueInBrackets(val))
        ).catch(err => console.log(err));
        return result.join(" ");
      } else {
        return await replaceValueInBrackets(str);
      }
    };

    if (source.search("{") >= 0) {
      if (source.search("and") >= 0) {
        return isAndInString(source);
      } else {
        const arr = source.split(",");
        if (arr.length > 1) {
          const result = await Promise.all(
            arr.map(val => isAndInString(val))
          ).catch(err => console.log(err));

          return auxiliary(result.join(","));
        } else {
          const arr = source.split(" ");
          if (arr.length > 1) {
            const result = await Promise.all(
              arr.map(val => auxiliary(val))
            ).catch(err => console.log(err));

            return auxiliary(result.join(" "));
          } else {
            const result = await replaceValueInBrackets(source);
            return auxiliary(result);
          }
        }
      }
    } else {
      return source;
    }
  };

  const dot = input.split("");
  const inputToArray = dot
    .splice(0, input.length - 1)
    .join("")
    .split(", ");

  const result = await Promise.all(inputToArray.map(v => auxiliary(v))).catch(err => console.log(err));

  return result.join(", ").concat(dot);
}

async function run() {
  let startTime = Date.now();
  let result = await mustache(`A:{{A}}, Y:{{Y}}, B:{{BB}}, Z:{{Z}} C:{{C}} D:{{DD}}.`, getData);
  let answeredCorrectly = (result === 'A:Alpha, Y:xY, B:xB1 and xB2, Z:xZ C:xC1, xC2, xF1 and xF2 D:Delta.');
  let duration = Date.now() - startTime;

  console.log({duration,result,answeredCorrectly});
}

run();
