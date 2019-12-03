
pragma solidity ^0.5.9;

contract Avocado{
    
    address root;
    address linkerUser;
    
    address payable seller;
    address payable buyer;
    
    
    struct FirstInfo{
        address linkerUser;
        string genesisInfo;
        string description;
        uint repuve;
    }

    struct OwnerData{
        address owner;
        string description;
    }

    struct Purchase{
        address nowner;
        uint value;
        string description;
    }
    
    FirstInfo[] firstI; 
    OwnerData[] owners;
    Purchase[] purchases;
    
    constructor() public{
        root = msg.sender;
    }
    

    function addUser(address m) public{
        require(msg.sender == root);
        linkerUser = m;
    }
    
    function setData(string memory newData) public returns(uint) {
        require(linkerUser == msg.sender);
        require(firstI.length==0);
        string memory op = '{"operation":"registry", "typeoperation":"New Data was added"}';
        uint n = firstI.length - 1;
        FirstInfo memory v = FirstInfo(msg.sender,newData,op,n);
        OwnerData memory o = OwnerData(msg.sender,'{"operation":"newOwner", "typeoperation":"New Owner was added"}');
        owners.push(o);
        firstI.push(v);
        return v.repuve;
    }
    
    function getData(address vehicle) view public returns(string memory){
        require(address(this)==vehicle);
        uint index = firstI.length - 1;
        string memory regreso;
        if(index<0){
            regreso ='No se ha registrado ningún auto';
        }else{
            regreso = firstI[index].genesisInfo;
        }
        return regreso;
    }
    

    function buy(address thiscontract, uint amount) payable public {
        uint ro=owners.length-1;
        require(owners[ro].owner!=msg.sender); 
        require(address(this)==thiscontract); 
        require(address(msg.sender).balance>=amount);
        msg.value; // it is necessary to do a relation with the umount
        string memory op = '{"operation:"buy","date":"01/09/2019"}';
        Purchase memory p = Purchase(msg.sender,amount,op);
        purchases.push(p);
    }

}