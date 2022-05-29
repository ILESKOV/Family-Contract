const { expect } = require("chai");
const { ethers } = require('hardhat');

describe('ERC721 FAMILY COLLECTION', function (){
    beforeEach(async function(){
        [owner, wallet1, wallet2] = await ethers.getSigners();

        Family = await ethers.getContractFactory('Family', owner);
        family = await Family.deploy();

        await family.toggleIsMintEnabled();

        await family.connect(wallet1).mintHuman("Bob", { value: ethers.utils.parseEther("0.05")});
        await family.connect(wallet1).mintHuman("Alice", { value: ethers.utils.parseEther("0.05")});
    });
describe('mintHuman FUNCTION TESTING', function() {
    beforeEach(async function(){        
        await family.connect(wallet1).giveThemSomePrivacy(0,1,"littleBobby", "littleAlice");
    });
    
    it('should not allow mint tokens if user already have two tokens', async function () {
        await expect(family.connect(wallet1).mintHuman("Bob", { value: ethers.utils.parseEther("0.05")})
        ).to.be.revertedWith("exceeds max per wallet")        
    })
    
    it('should not allow mint tokens while Minting is disabled by owner', async function () {
        await family.toggleIsMintEnabled();

        await expect(family.connect(wallet2).mintHuman("Bob", { value: ethers.utils.parseEther("0.05")})
        ).to.be.revertedWith("minting not enabled")        
    })

    it('should not allow mint tokens without enoght mint value', async function () {
        await expect(family.connect(wallet2).mintHuman("Bob", { value: ethers.utils.parseEther("0.04")})
        ).to.be.revertedWith("wrong value")        
    })

    it('should not allow mint tokens if max supply is reached', async function () {
        await family.connect(wallet2).mintHuman("James", { value: ethers.utils.parseEther("0.05")})
        await family.connect(wallet2).mintHuman("Eve", { value: ethers.utils.parseEther("0.05")})
        await family.mintHuman("Henry", { value: ethers.utils.parseEther("0.05")})
        await expect(family.mintHuman("Michel", { value: ethers.utils.parseEther("0.05")})
        ).to.be.revertedWith("sold out")        
    })
    
    it('should mint second token to wallet 1', async function () {
        HumanData = new Array();
        HumanData = await family.getDataAboutHuman(0);
        gender = HumanData[0];
        name = HumanData[1];
        age = HumanData[2];
        interactionTime = HumanData[3];
        boss = HumanData[4];
        expect(gender).to.equal(0);
        expect(name).to.equal("Bob");
        expect(age).to.equal(18);
        console.log("Boby's interaction time is: " + interactionTime);
        expect(boss).to.equal(wallet1.address);       
    })
    
    it('should mint second token to wallet 1', async function () {
        HumanData = new Array();
        HumanData = await family.getDataAboutHuman(1);
        gender = HumanData[0];
        name = HumanData[1];
        age = HumanData[2];
        interactionTime = HumanData[3];
        boss = HumanData[4];
        expect(gender).to.equal(1);
        expect(name).to.equal("Alice");
        expect(age).to.equal(18);
        console.log("Alice's interaction time is: " + interactionTime);
        expect(boss).to.equal(wallet1.address);       
    })

    })      
    describe('giveThemSomePrivacy FUNCTION TESTING', function() {
        beforeEach(async function(){
            await family.connect(wallet2).mintHuman("James", { value: ethers.utils.parseEther("0.05")});
            await family.connect(wallet2).mintHuman("Eve", { value: ethers.utils.parseEther("0.05")});   
        });
        
        it('should not allow create kid token if max supply is reached', async function () {
            await family.connect(wallet2).giveThemSomePrivacy(2,3,"littleBobby", "littleAlice")
            await family.connect(wallet2).giveThemSomePrivacy(2,3,"littleBobby", "littleAlice")
            await expect(family.connect(wallet1).giveThemSomePrivacy(1,2,"littleBobby", "littleAlice")
            ).to.be.revertedWith("sold out")        
        })

        it('should not allow create kid token with only one parent token', async function () {
            await expect(family.connect(wallet1).giveThemSomePrivacy(0,0,"littleBobby", "littleAlice")
            ).to.be.revertedWith("can't reproduce himself alone");
            await expect(family.connect(wallet1).giveThemSomePrivacy(0,0,"littleBobby", "littleAlice")
            ).to.be.revertedWith("can't reproduce himself alone");       
        })

        it('should not allow create kid token from not users token', async function () {
            await expect(family.connect(wallet1).giveThemSomePrivacy(0,2,"littleBobby", "littleAlice")
            ).to.be.revertedWith("1 ore more humans isn't yours");
            await expect(family.connect(wallet1).giveThemSomePrivacy(2,0,"littleBobby", "littleAlice")
            ).to.be.revertedWith("1 ore more humans isn't yours");       
        })

        it('should not allow create kid token if parent age is below 18 y.o', async function () {
            await family.connect(wallet2).giveThemSomePrivacy(2,3,"littleBobby", "littleAlice")
            await expect(family.connect(wallet2).giveThemSomePrivacy(3,4,"littleBobby", "littleAlice")
            ).to.be.revertedWith("only 18+")        
        })

        it('should mint Kid token to wallet 1', async function () {
            await family.connect(wallet1).giveThemSomePrivacy(0,1,"littleBobby", "littleAlice")
            HumanData = new Array();
            HumanData = await family.getDataAboutHuman(4);
            gender = HumanData[0];
            name = HumanData[1];
            age = HumanData[2];
            interactionTime = HumanData[3];
            boss = HumanData[4];
            console.log("Kid is " + gender + " gender( 2 => Boy and 3 => Girl ) ");
            console.log("Kid name is "+ name);
            expect(age).to.equal(0);
            console.log("Baby interaction time is: " + interactionTime);
            expect(boss).to.equal(wallet1.address);       
        })
        
    })   
    
    describe('checkAgeChanging FUNCTION TESTING', function() {
        beforeEach(async function(){          
            await family.connect(wallet2).mintHuman("James", { value: ethers.utils.parseEther("0.05")})
            await family.connect(wallet1).giveThemSomePrivacy(0,1,"littleBobby", "littleAlice");
        });
        
        it('should not allow mint tokens if user already have two tokens', async function () {
            await expect(family.connect(wallet1).checkAgeChanging(2)
            ).to.be.revertedWith("only check age for owner humans")        
        })    

        it('should properly return age of given humans', async function () {
            await expect((await family.connect(wallet1).callStatic.checkAgeChanging(0)).toNumber()
            ).to.be.equal(18);  
            await expect((await family.connect(wallet1).callStatic.checkAgeChanging(3)).toNumber()
            ).to.be.equal(0);      
        })  
    })      
})


