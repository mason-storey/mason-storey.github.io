// CLASS FOR GENERIC REGISTERS
class register {
    constructor(){
        this.value = 0;             // VALUE ASSOCIATED WITH THE REGISTER
    }

    getValue(){
        return this.value;
    }

    setValue(newValue){
        this.value = newValue;
    }

    increment(){
        this.value += 1;
    }
}

