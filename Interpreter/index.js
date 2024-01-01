const PUSH = "PUSH";
const STOP = "STOP";
const ADD = "ADD";
const SUB = "SUB";
const MUL = "MUL";
const DIV = "DIV";
const LT = "LT";
const GT = "GT";
const EQ = "EQ";
const AND = "AND";
const OR = "OR";
const JUMP = "JUMP";
const JUMPI = "JUMPI";
const STORE = "STORE";
const LOAD='LOAD';
const EXECUTION_COMPLETE = "EXECUTION_COMPLETE";
const EXECUTION_LIMIT = 10000;
const OPCODE_MAP = {
  PUSH,
  STOP,
  ADD,
  SUB,
  MUL,
  DIV,
  LT,
  GT,
  EQ,
  AND,
  OR,
  JUMP,
  JUMPI,
  STORE,
  LOAD,
};
const OP_CODE_GAS = {
  PUSH: 0,
  STOP: 0,
  ADD: 1,
  SUB: 1,
  MUL: 1,
  DIV: 1,
  LT: 1,
  GT: 1,
  EQ: 1,
  AND: 1,
  OR: 1,
  JUMP: 2,
  JUMPI: 2,
  STORE: 5,
  LOAD:5

};
class InterPreter {
  constructor({ storageTrie } = {}) {
    this.state = {
      programCount: 0,
      stack: [],
      code: [],
      executionCount: 0,
    };
    this.storageTrie = storageTrie;
  }
  jump() {
    const destination = this.state.stack.pop();
    if (destination < 0 || destination > this.state.code.length) {
      throw new Error(`Invalid destination error:${destination}`);
    }
    this.state.programCount = destination;
    this.state.programCount--;
  }
  runCode(code) {
    this.state.code = code;
    let gasUsed = 0;
    while (this.state.programCount < this.state.code.length) {
      this.state.executionCount++;
      if (this.state.executionCount > EXECUTION_LIMIT) {
        throw new Error(
          `Check for an infinite loop.Execution limit of ${EXECUTION_LIMIT} exceeded`
        );
      }
      const OP_CODE = this.state.code[this.state.programCount];
      gasUsed += OP_CODE_GAS[OP_CODE];
      let key;
      let value;
      try {
        switch (OP_CODE) {
          case STOP:
            throw new Error(EXECUTION_COMPLETE);
          case PUSH:
            this.state.programCount++;
            if (this.state.programCount === this.state.code.length) {
              throw new Error(`The PUSH instruction cannot be last`);
            }
            value = this.state.code[this.state.programCount];
            this.state.stack.push(value);
            break;
          case ADD:
          case SUB:
          case MUL:
          case DIV:
          case LT:
          case GT:
          case EQ:
          case AND:
          case OR:
            const a = this.state.stack.pop();
            const b = this.state.stack.pop();
            let result;
            if (OP_CODE === ADD) result = a + b;
            if (OP_CODE === SUB) result = a - b;
            if (OP_CODE === MUL) result = a * b;
            if (OP_CODE === DIV) result = a / b;
            if (OP_CODE === LT) result = a < b ? 1 : 0;
            if (OP_CODE === GT) result = a > b ? 1 : 0;
            if (OP_CODE === EQ) result = a === b ? 1 : 0;
            if (OP_CODE === AND) result = a && b;
            if (OP_CODE === OR) result = a || b;
            this.state.stack.push(result);
            break;
          case JUMP:
            this.jump();
            break;
          case JUMPI:
            const condition = this.state.stack.pop();
            if (condition === 1) {
              this.jump();
            }
            break;
          case STORE:
            key = this.state.stack.pop();
            value = this.state.stack.pop();
            this.storageTrie.put({ key, value });
            break;
          case LOAD:
            key=this.state.stack.pop();
            value=this.storageTrie.get({key});
            this.state.stack.push(value);
            break;
          default:
            break;
        }
      } catch (error) {
        if (error.message == EXECUTION_COMPLETE) {
          return {
            result: this.state.stack[this.state.stack.length - 1],
            gasUsed,
          };
        }
        throw error;
      }
      this.state.programCount++;
    }
  }
}
InterPreter.OPCODE_MAP = OPCODE_MAP;
module.exports = InterPreter;
// let code = [PUSH, 1, PUSH, 2, ADD, STOP];
// console.log(new InterPreter().runCode(code));
// code = [PUSH, 1, PUSH, 2, SUB, STOP];
// console.log(new InterPreter().runCode(code));
// code = [PUSH, 1, PUSH, 2,MUL, STOP];
// console.log(new InterPreter().runCode(code));
// code = [PUSH, 1, PUSH, 2,DIV, STOP];
// console.log(new InterPreter().runCode(code));
// code = [PUSH, 1, PUSH, 2,LT, STOP];
// console.log(new InterPreter().runCode(code));
// code = [PUSH, 1, PUSH, 2,GT, STOP];
// console.log(new InterPreter().runCode(code));
// code = [PUSH, 0, PUSH, 1,EQ, STOP];
// console.log(new InterPreter().runCode(code));
// code = [PUSH, 0, PUSH, 1,AND, STOP];
// console.log(new InterPreter().runCode(code));
// code = [PUSH, 0, PUSH, 1,OR, STOP];
// console.log(new InterPreter().runCode(code));
// code=[PUSH,6,JUMP,PUSH,0,JUMP,PUSH,"jump Successful",STOP];
// console.log(new InterPreter().runCode(code));
// code=[PUSH,8,PUSH,1,JUMPI,PUSH,0,JUMP,PUSH,"Jumpi successful",STOP];
// console.log(new InterPreter().runCode(code));
// code=[PUSH,99,JUMP,PUSH,0,JUMP,PUSH,"jump Successful",STOP];
// try {
//     console.log(new InterPreter().runCode(code));
// } catch (error) {
//     console.log(error.message);
// }
// code=[PUSH,0,PUSH];
// try {
//     console.log(new InterPreter().runCode(code));
// } catch (error) {
//     console.log(error.message);
// }
// code=[PUSH,0,JUMP,STOP];
// try {
//     console.log(new InterPreter().runCode(code));
// } catch (error) {
//     console.log(error.message);
// }
