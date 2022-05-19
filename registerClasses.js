// CLASS FOR GENERIC REGISTERS
class register {
    constructor(){
        this.value = 0;             // VALUE ASSOCIATED WITH THE REGISTER
    }

    // GETTER FOR VALUE STORED IN REGISTER
    getValue(){
        return this.value;
    }

    // SETTER OF VALUE STORED IN REGISTER
    setValue(newValue){
        this.value = newValue;
    }

    // INCREMENTS VALUE OF THE REGISTER
    increment(){
        this.value += 1;
    }
}

