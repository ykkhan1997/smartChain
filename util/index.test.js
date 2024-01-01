const {keccakHash,sortCharacter}=require("./index");

describe("uitl",()=>{
    describe("sortCharacter()",()=>{
        it("create the string for the object with the same properties in a different order",()=>{
            expect(sortCharacter({"foo":"bar","bar":"foo"})).toEqual(sortCharacter({"bar":"foo","foo":"bar"}));
        });
        it("create the different string for different objects",()=>{
            expect(sortCharacter({"foo":"foo"})).not.toEqual(sortCharacter({"foo":"bar"}));
        });
    });
    describe("keccakHash()",()=>{
        it("generate a hash",()=>{
            expect(keccakHash({"foo":"bar"})).toEqual("4527ed5350f32c6b456088a911f5590088fc519e53e52e350382fa57ea49e51e");
        });
    });
})