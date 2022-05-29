//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract Family is ERC721, Ownable{


uint public mintPrice = 0.05 ether;
uint public totalSupply;
uint public maxSupply;
bool public isMintEnabled;

mapping (uint => address) public humanToOwner;
mapping (address => uint) public ownerHumanCount;

    enum GENDER{MAN, WOMEN, KID_BOY, KID_GIRL}

    struct Human{
       GENDER gender;
       string name;  
       uint32 age;
       uint32 interactionTime;  
       address boss; 
       }

    Human[] public peoples;


event NewHuman(GENDER indexed _gender, string _name, uint indexed _age, uint32 _interactionTime, address indexed _boss);

constructor() payable ERC721("Family", "FAM"){
    maxSupply = 6;
}

function toggleIsMintEnabled() external onlyOwner{
    isMintEnabled = !isMintEnabled;
}

function setMaxSupply(uint _maxSupply) external onlyOwner{
    maxSupply = _maxSupply;
}

function mintHuman(string memory _name) external payable{
    require(isMintEnabled, "minting not enabled");
    require(ownerHumanCount[msg.sender] < 2, "exceeds max per wallet");
    require(msg.value == mintPrice, "wrong value");
    require(maxSupply > totalSupply, "sold out");

    if(ownerHumanCount[msg.sender] == 0){
      _mintHuman();
      uint32 _interactionTime = uint32(block.timestamp);
      Human memory man = Human({gender: GENDER.MAN,
                                name: _name,
                                age: 18,
                                interactionTime: _interactionTime,
                                boss: msg.sender});
      peoples.push(man);
      emit NewHuman(GENDER.MAN, _name, 18, _interactionTime, msg.sender);
    } else {
      _mintHuman();
      uint32 _interactionTime = uint32(block.timestamp);
      Human memory women = Human({gender: GENDER.WOMEN,
                                  name: _name,
                                  age: 18,
                                  interactionTime: _interactionTime,
                                  boss: msg.sender});
      peoples.push(women);
      emit NewHuman(GENDER.WOMEN, _name, 18, _interactionTime, msg.sender);
    }
}

function giveThemSomePrivacy(uint _firstParentID, uint _secondParentID, string memory _boyName, string memory _girlName) external {
    require(maxSupply > totalSupply, "sold out");
    require(_firstParentID != _secondParentID, "can't reproduce himself alone");
    require(humanToOwner[_firstParentID] == msg.sender && humanToOwner[_secondParentID] == msg.sender, "1 ore more humans isn't yours");
    checkAgeChanging(_firstParentID);
    checkAgeChanging(_secondParentID);    
    require(peoples[_firstParentID].age >= 18 && peoples[_secondParentID].age == 18, "only 18+");
    require((peoples[_firstParentID].gender) != (peoples[_secondParentID].gender), "it would't work");
    _mintHuman();
    uint random = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _boyName, _girlName))) % 2;
    uint32 birthTime = uint32(block.timestamp);
    Human memory kid;
    if(random == 0){
    Human memory newKid = Human({gender: GENDER.KID_BOY,
                              name: _boyName,
                              age: 0,
                              interactionTime: birthTime,                               
                              boss: msg.sender});
    emit NewHuman(GENDER.KID_BOY, _boyName, 0, birthTime, msg.sender);
    kid = newKid;
    }else {
    Human memory newKid = Human({gender: GENDER.KID_GIRL,
                              name: _girlName,
                              age: 0,
                              interactionTime: birthTime,                               
                              boss: msg.sender});
    emit NewHuman(GENDER.KID_GIRL, _girlName, 0, birthTime, msg.sender);
    kid = newKid;
    }
    peoples.push(kid);
}
function checkAgeChanging(uint _id)public returns(uint){
    require(humanToOwner[_id] == msg.sender, "only check age for owner humans");
    peoples[_id].age += ((uint32(block.timestamp) - peoples[_id].interactionTime) / 86400); //1 day equal 1 year
    peoples[_id].interactionTime = uint32(block.timestamp);
    if(peoples[_id].gender == GENDER.KID_BOY && peoples[_id].age >= 18){
        peoples[_id].gender = GENDER.MAN;
        return peoples[_id].age;
    } else if(peoples[_id].gender == GENDER.KID_GIRL && peoples[_id].age >= 18){
        peoples[_id].gender = GENDER.WOMEN;
        return peoples[_id].age;
    } else{
    return peoples[_id].age;
    }
}
function _mintHuman()private {
    ownerHumanCount[msg.sender]++;
    uint tokenId = totalSupply;
    totalSupply++;
    humanToOwner[tokenId] = msg.sender;
    _safeMint(msg.sender, tokenId);
}

function getDataAboutHuman(uint _id) external view returns(Human memory){
    return peoples[_id];
}
}