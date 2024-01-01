const InterPreter = require(".");
const Trie = require("../store/trie");

const {
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
    LOAD
}=InterPreter.OPCODE_MAP;
describe("Interpreter",()=>{
    describe("and the code include ADD",()=>{
        it("add two values",()=>{
            expect(new InterPreter().runCode([PUSH,2,PUSH,3,ADD,STOP]).result).toEqual(5);
        });
    });
    describe("and the code include SUB",()=>{
        it("sub the two values",()=>{
            expect(new InterPreter().runCode([PUSH,2,PUSH,3,SUB,STOP]).result).toEqual(1);
        });;
    });
    describe("and the code include MUL",()=>{
        it("mul the two values",()=>{
            expect(new InterPreter().runCode([PUSH,2,PUSH,3,MUL,STOP]).result).toEqual(6);
        });
    });
    describe("and the code include DIV",()=>{
        it("div the two values",()=>{
            expect(new InterPreter().runCode([PUSH,2,PUSH,3,DIV,STOP]).result).toEqual(1.5);
        });
    });
    describe("and the code include LT",()=>{
        it("check that one value is less than another",()=>{
            expect(new InterPreter().runCode([PUSH,2,PUSH,3,LT,STOP]).result).toEqual(0);
        });
    });
    describe("and the code include GT",()=>{
        it("check that one value is greater than another",()=>{
            expect(new InterPreter().runCode([PUSH,2,PUSH,3,GT,STOP]).result).toEqual(1);
        });
    });
    describe("and the code include EQ",()=>{
        it("check that one value is equal to another",()=>{
            expect(new InterPreter().runCode([PUSH,2,PUSH,3,EQ,STOP]).result).toEqual(0);
        });
    });
    describe("and the code include AND",()=>{
        it("ands two values",()=>{
            expect(new InterPreter().runCode([PUSH,1,PUSH,0,AND,STOP]).result).toEqual(0);
        });
    });
    describe("and the code include OR",()=>{
        it("ors two values",()=>{
            expect(new InterPreter().runCode([PUSH,1,PUSH,0,OR,STOP]).result).toEqual(1);
        });
    });
    describe("and the code include JUMP",()=>{
        it("jumps to a destination",()=>{
            expect(new InterPreter().runCode([PUSH,6,JUMP,PUSH,0,JUMP,PUSH,"jump successful",STOP]).result).toEqual("jump successful");
        });
    });
    describe("and the code include JUMPI",()=>{
        it("jumpi to a destination",()=>{
            expect(new InterPreter().runCode([PUSH,8,PUSH,1,JUMPI,PUSH,0,JUMP,PUSH,"Jumpi successful",STOP]).result).toEqual("Jumpi successful");
        });
    });
    describe("and the code include STORE",()=>{
        it("store a value",()=>{
            const interpreter=new InterPreter({
                storageTrie:new Trie()
            });
            const key='foo';
            const value='bar';
            interpreter.runCode([PUSH,value,PUSH,key,STORE,STOP]);
            expect(interpreter.storageTrie.get({key})).toEqual(value);
        });
    });
    describe("and the code include LOAD",()=>{
        it("load the values",()=>{
            const interpreter=new InterPreter({storageTrie:new Trie()});
            const key="foo";
            const value='bar';
            const code=[PUSH,value,PUSH,key,STORE,PUSH,key,LOAD,STOP];
            expect(interpreter.runCode(code).result).toEqual(value);
        });
    })
    describe("and the code include an invalid destination",()=>{
        it("throw an error",()=>{
            expect(()=>new InterPreter().runCode([PUSH,99,JUMP,PUSH,0,JUMP,PUSH,"jump successful",STOP])).toThrow('Invalid destination error:99');
        });
    });
    describe("and the code include an invalid push error",()=>{
        it("throw an error",()=>{
            expect(()=>new InterPreter().runCode([PUSH,0,PUSH])).toThrow(`The PUSH instruction cannot be last`);
        });
    });
    describe("and the code include an infinite loop",()=>{
        it("throw an error",()=>{
            expect(()=>new InterPreter().runCode([PUSH,0,JUMP,STOP])).toThrow(/Check for an infinite loop/);
        });
    });
});