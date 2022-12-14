class Fibonacci{
    constructor(){
        this.list = [0, 1, 1, 2];
    }

    get(index){    
        let i = this.list.length - 1;
    
        while (index >= this.list.length) {
            this.list.push(this.list[i] + this.list[i - 1]);
            i++;
        }
        
        return this.list[index];
    }
}