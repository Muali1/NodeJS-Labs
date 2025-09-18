    const [, , action, ...args] = process.argv;
    console.log("Action:", action, "Numbers:", args);

    function addAll(nums) {
    return nums.reduce((sum, n) => sum + Number(n), 0);
    }

    function divideTwo(nums) {
    if (Number(nums[1]) === 0) {
        console.error("Error: cannot divide by zero");
        return;
    }
    return Number(nums[0]) / Number(nums[1]);
    }

    function subtractAll(nums) {
    if (nums.length < 2) {
        console.error("Error: need at least 2 numbers for subtraction");
        return;
    }
    return nums.reduce((diff, n) => diff - Number(n));
    }

    function multiplyAll(nums) {
    if (nums.length < 2) {
        console.error("Error: need at least 2 numbers for multiplication");
        return;
    }
    return nums.reduce((prod, n) => prod * Number(n), 1);
    }

    let output;

    switch (action) {
    case "add":
        output = addAll(args);
        break;
    case "div":
        output = divideTwo(args);
        break;
    case "sub":
        output = subtractAll(args);
        break;
    case "multi":
        output = multiplyAll(args);
        break;
    default:
        console.error("Unknown action. Use: add | sub | multi | div");
        break;
    }

    if (output !== undefined) {
    console.log("Result:", output);
    }
