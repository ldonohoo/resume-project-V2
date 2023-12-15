// compute the pixels per rem for a given screen size
//		(used when positioning leaves on tree)
let bodyFontSize = window.getComputedStyle(document.body, null).getPropertyValue("font-size");
pixelsPerRem = parseInt(bodyFontSize.slice(0, -2));
const remToPixels = (rem) => { return `${rem * pixelsPerRem}`; };


//functions:
function openResume() {
	window.open("images/lisa-donohoo-resume.rtf", "_blank");
}

//not currently used....functional but not very interesting 
function ballDrop() {
    let ball = document.getElementById("ball");
    let name = document.getElementById("name");
    ball.style.animation= "ball-drop 8s both";
}

class Canopy {
	constructor(numLeaves) {
		this.numLeaves = numLeaves;
		this.isfull = false;
        this.leavesByBranch = [];
	}
	getLeaves() {
		//console.log("getleaves start"+ this.numLeaves+"!!!");
		//functions to support getleaves:
		// make new leaf elements in the dom! should be able to move 
		function getLeafProfile(profileNum) {
			let profile = [];
			// leaf profiles: "leaves" are made taking boxes and applying
			//				asymetrical border radii.
			//		heights and widths for box size, raidii refers to top, 
			//		right, bottom, left profiles 
			// leaf shapes in rem below to make leaf size responsive:
			const leafWidth1 = remToPixels(.75) + "px";
			const leafHeight1 = remToPixels(.75) + "px";
			const leafWidth2 = remToPixels(1) + "px";
			const leafHeight2 = remToPixels(.5) + "px";
			const sideRadius1 = remToPixels(.06) + "px";
			const sideRadius2 = remToPixels(.5) + "px";
			const sideRadius3 = remToPixels(.016) + "px";
			const sideRadius4 = remToPixels(.5) + "px";
			// four leaf profiles:
			switch (profileNum) {
				case 0: 
					profile = [leafWidth1, leafHeight1, sideRadius1, sideRadius2, sideRadius3, sideRadius4];
					break 
				case 1: 
					profile = [leafWidth1, leafHeight1, sideRadius4, sideRadius1, sideRadius2, sideRadius3];
					break; 
				case 2:
					profile = [leafWidth2, leafHeight2, sideRadius1, sideRadius2, sideRadius3, sideRadius4];
					break;
				case 3:
				default:
					profile = [leafWidth2, leafHeight2, sideRadius4, sideRadius1, sideRadius2, sideRadius3];
				break;
			}
			return profile;
		}
		function randomColor () {
			// get random leaf colors: greens and yellows and oranges (but mostly greens)
			let rbg = Math.floor(Math.random() * 5);
			let redComponent = 0,
				greenComponent= 0,
				blueComponent = 0; 
			// switch to select leaf color variations: 2/5 yellowish & redish & 3/5 greener (more green leaves)
			switch (rbg) {
				case 1: 
				case 2:
					redComponent = Math.floor(Math.random() * 188 + 23); //rand 23-210 red
					greenComponent = 210;
					blueComponent = 23;	
					break;
				case 3:
				case 4:
				case 5:
					redComponent = 210;
					greenComponent = Math.floor(Math.random() * 121 + 90); //rand 90-210 green
					blueComponent = 23;
					break;
				default: 
					redComponent = Math.floor(Math.random() * 120);
					greenComponent = Math.floor(Math.random() * 120);
					blueComponent = 23;
					break;
			}
			return `rgb(${redComponent}, ${greenComponent}, ${blueComponent})`;
		}
		const leafFactory = (angle, xpos, ypos, color, leafNo, branch) => {
			// create new div element with unique leaf id!

			// get random leaf shape/profile
			const leafProfile = getLeafProfile(Math.floor(Math.random() * 4));
			const leafRadii = ` ${leafProfile[2]} ${leafProfile[3]} ${leafProfile[4]} ${leafProfile[5]}`;
	
			// create new leaf element
			const leaf = document.createElement("div");
			leaf.setAttribute("id", "leaf" + leafNo);
			// create new attribute for DOM element: store branch number of leaf
			const branchAttribute = document.createAttribute("branch");
			//console.log("creating leaf with branch:"+branch+"....");
			branchAttribute.value = branch;
			leaf.setAttributeNode(branchAttribute);
			leaf.style.position = "absolute";
			leaf.style.width = leafProfile[0];
			leaf.style.height = leafProfile[1];
			leaf.style.borderRadius = leafRadii;
			leaf.style.background = color;
			leaf.style.transformOrigin = "center";
			leaf.style.left = `${xpos}px`;
			leaf.style.top = `${ypos}px`;
	
			return {leaf, leafNo, branch};
		}
		function findBranch(xpos, ypos, maxLeft, maxTop) {
			//console.log("findbranch here");
			// find what quadrand of tree leaves are in and assign a branch number
			let maxLeft1 = Math.floor(maxLeft/2); 	 //8/2	= 4
			let maxLeft2 = maxLeft- maxLeft1; 		 //8-4 = 4
			//console.log(" maxlft2="+maxLeft2+" ");
			// if division of quadrant is equal set to next number
			if (maxLeft % 2 != 0) { maxLeft2 = maxLeft1 + 1;}  //4+1 = 5
			let maxTop1 = Math.floor(maxTop/2);		//13/2 = 6
			let maxTop2 = maxTop - maxTop1;			//13-6 = 7
			if (maxTop % 2 != 0) { maxTop2 = maxTop1 + 1;}  //4+1 = 5

			//console.log("maxl1:"+maxLeft1+" maxl2:"+maxLeft2+" maxt1:"+maxTop1+" maxt2:"+maxTop2);

			
			if (xpos <= maxTop1 && ypos <= maxLeft1) {   	  // in 1st quadrant  3 <= 6
				//console.log("q1 returning xpos="+xpos+"ypos="+ypos);
				return 0;	//return branch #0 (quadrant 1)
			} else if (xpos < maxTop1 && ypos > maxLeft2) {  // in 2nd quadrant
				//console.log("q2 returning xpos="+xpos+"ypos="+ypos);
				return 1;	//return branch #1 (quadrant 2)
			} else if (xpos > maxTop2 && ypos <= maxLeft1) {  // in 3rd quadrant
				//console.log("q3 returning xpos="+xpos+"ypos="+ypos);
				return 2;	//return branch #2 (quadrant 3)
			} else if (xpos > maxTop2 && ypos > maxLeft2) {   // in 4th quadrant
				//console.log("q4 returning xpos="+xpos+"ypos="+ypos);
				return 3;	//return branch #3 (quadrant 4)
			} else {
				return 0;  //shouldn't get here...
				//console.log("oooops");
			}
 		
        
        }

		// populate tree with leaves and append element to .treebox 

		if (this.isfull) {
			alert("Tree already has plenty of leaves...");
		} else {
			console.log(":end of getleaves:getting leaves now:" + this.numLeaves+"!!!");
			let leavesByBranch1 = [], leavesByBranch2 = [], leavesByBranch3 = [], leavesByBranch4 = [];
			let maxLeft = 13.2;  //max xpos from start in rem
			let maxTop = 8;		//max ypos from start in rem
			for (let i = 0; i < this.numLeaves; i++) {
				// random leaf position, leaf angle, and greenish color
				let xpos = remToPixels(Math.random() * maxLeft);
				let ypos = remToPixels(Math.random() * maxTop);
				let branch = findBranch(xpos, ypos, remToPixels(maxLeft), remToPixels(maxTop));
				//console.log("branch found while pop leaves:"+branch+"::::");
				let angle = Math.floor(Math.random() * 359);
				let color = randomColor();
				let newLeafInfo = leafFactory(angle, xpos, ypos, color, i, branch);
				let newLeafNo = newLeafInfo.leafNo;
				let newLeafElement = newLeafInfo.leaf;
				document.getElementById("treebox").appendChild(newLeafElement);
				//populate leavesByBranch array
				if (newLeafInfo.branch === 0) { 
					console.log("end of getleaves pop leavesbybranch branch1 " + newLeafNo );
					leavesByBranch1.push(newLeafNo); }
				if (newLeafInfo.branch === 1) { leavesByBranch2.push(newLeafNo); }
				if (newLeafInfo.branch === 2) { leavesByBranch3.push(newLeafNo); }
				if (newLeafInfo.branch === 3) { leavesByBranch4.push(newLeafNo); }
			}
			//tree is full if at least one leaf created in treebox
			if (this.numLeaves > 1) {
				this.isfull = true;  
			} else {
				this.isfull = false;
			}
			//store leavesByBranch in canopy object so breeze can use later
			console.log("end of getleaves by branching: "+ leavesByBranch1 + "     "+  leavesByBranch2 + "     "+ leavesByBranch3 + "     " + leavesByBranch4);
			this.leavesByBranch.push(leavesByBranch1, leavesByBranch2, leavesByBranch3, leavesByBranch4);
			console.log("end of getleaves branch array: "+ this.leavesByBranch );
		}
	}
	breeze(type) {
		//console.log("breeze start: " + type + this.numLeaves);
		
		function getBranchAttrib(leafNo) {
			let leafId = "leaf" + leafNo;
			// get leaf element 
			let queryLeafId = `#${leafId}`;
			let leaf = document.querySelector(queryLeafId);
			console.log("  leaf: "+leaf.innerHTML);
			console.log("  Attbranch:"+ leaf.getAttribute("branch")+ "]]");
			return leaf.getAttribute("branch");
		}
		function getLeafNos(amountOfLeavesToAnim, branchNo, leavesInBranch) {
			//get random, non-repeatable array of leaf numbers to correspond to leaf element #ids
 			let leafNoArray = [];
            let leafIndex = null, leafNo = null;
			if (amountOfLeavesToAnim > leavesInBranch.length) {
			 	amountOfLeavesToAnim = leavesInBranch.length;
				console.log("changing leaves to animate as only "+ leavesInBranch.length + " leaves avail...");
			}
			console.log("beg of getLeafNos hereeeeee....");
			console.log("anmin leaves: "+ amountOfLeavesToAnim);
			for (let i = 0; i < amountOfLeavesToAnim; i++) {
                branchNo = Number(branchNo);

                console.log(" branchno: "+ branchNo);
                console.log("mid getleaves finding leaf arrays, adding leaves");
                console.log("leaves in branch"+leavesInBranch);
                leafIndex = Math.floor(Math.random() * leavesInBranch.length);
				console.log("leafindex: "+ leafIndex);

				leafNo = leavesInBranch[leafIndex];
                /*while (leafNoArray.includes(leafNo)) {
					console.log("get another number");
                    leafIndex = Math.floor(Math.random() * leavesInBranch[branchNo].length);
                    leafNo = leavesInBranch[leafIndex];
					console.log("leafno:"+leafNo);
                }*/
       			leafNoArray.push(leafNo);  // add to selection of leaves to animate
				leavesInBranch.pop();  		// remove leaf from selection process	
				console.log(" leafno:"+leafNo+ " leafnoarray in progres:"+leafNoArray);
			}
			console.log("end of getleaves leaf array:"+ leafNoArray+"!!!");
			return leafNoArray;
		}
		/*  no longer used...
		function getBranchSizes(totalLeavesToAnim) {
			//from the total leaves to be animated, compute the size of each branch
			//      (div total by 4 and make sure remainder is accounted for)
			let q1Leaves = 0, q2Leaves = 0, q3Leaves = 0, q4Leaves = 0;
			let branchSizes = [];
			//divide number of leaves into 4 branches/quadrants
			branchSizes[0] = Math.floor(totalLeavesToAnim/4);
			branchSizes[1] = branchSizes[0];
			branchSizes[2] = branchSizes[0];
			//if not evenly divisible by 4, add extra leaves to 4th branch/quadrant
			if ((totalLeavesToAnim % 4) != 0 ) { 
				branchSizes[3] = (branchSizes[0] * 3) - branchSizes[0]; 
				console.log("remainer...so: q4="+ branchSizes[3]);
			} else {
				branchSizes[3] = branchSizes[0];
			};
			return branchSizes;
		} */
		function getAnimProfiles(numLeaves) {
			// set animation criteria for each breeze- 
			//		e.g.- a stronger breeze has more frequent branch movements so less delays between movements, etc.
			let animProfilesArr = [];
			let totalLeavesToAnim = 0;
			let branchesToAnim = [], branchNumOfLeavesToAnim = [], moveTypes = [], durations = [], delays = [], iters = [], timings = [];
			console.log("type in getanprof: "+type+"  ");
			switch (type) {
				case "strong":
					// (branches 0-3 correspond to quadrants 1-4 in typ. cartesian coord. sys)
					branchesToAnim = [0, 1, 2, 3];	// 
					branchNumOfLeavesToAnim = [50, 45, 45, 40];
					//moveTypes has an array of possibilites for each branch...
					moveTypes = [["wiggle", "twist"], ["wiggle","twist"], ["wiggle","twist"], ["wiggle"]];
					durations = [600, 400, 800, 500];
					delays = [0, 600, 0, 300];
					iters = [181, 184, 182, 180];
					timings = ["ease-in-out", "ease-in-out", "ease-in-out", "ease-in-out"];
					break;
				case "medium":
					// (branch locs equal to quadrants in cartesian sys)
					branchesToAnim = [0, 1, 3, 2];	
					branchNumOfLeavesToAnim = [15, 16, 25, 10];
					//moveTypes has an array of possibilites for each branch...
					moveTypes = [["wiggle", "wiggle"], ["blow-to-left"], ["twist"], ["wiggle", "twist"]];
					durations = [400, 400, 600, 300];
					delays = [0, 100, 200, 300];
					iters = [50, 40, 60, 40];
					timings = ["ease-in-out", "ease-in-out", "ease-in-out", "ease-in-out"];
					break;
				case "mild":  // a mild breeze is default
				default :    
					// (branch locs equal to quadrants in cartesian sys)
					branchesToAnim = [0, 1, 2, 3];	
					branchNumOfLeavesToAnim = [30, 30, 50, 20];
					//moveTypes has an array of possibilites for each branch...
					moveTypes = [["wiggle", "twist"], ["wiggle"], ["twist"], ["wiggle", "twist"]];
					durations = [500, 600, 500, 400];
					delays = [0, 0, 0, 0];
					iters = [4, 6, 2, 4];
					timings = ["ease-in-out", "ease-in-out", "ease-in-out", "ease-in-out"];
					console.log("in mild area...");
					break;			
			}
			// set total leaves to animate by summing branch leaves to animate
			totalLeavesToAnim = (branchNumOfLeavesToAnim.forEach(x => {	let sum = 0; sum += x; }));
			console.log("setting total leaves to animate to: "+totalLeavesToAnim);
			if (totalLeavesToAnim > numLeaves) { 
				this.numLeaves = totalLeavesToAnim;
				console.log("Warning: your total animation leaves exceeds canopy this will faillllll!!!");
			}
			console.log("num of branches:"+branchesToAnim.length+"  ");
			for (let i=0; i < branchesToAnim.length; i++) {
				//set array of animation profiles of length branchesToAnim 
				animProfilesArr.push({totalLeavesToAnim: totalLeavesToAnim, 
					branchToAnim: branchesToAnim[i], branchNumOfLeavesToAnim: branchNumOfLeavesToAnim[i],
					branchMoveType: moveTypes[i], branchDuration: durations[i], branchDelay: delays[i],
					branchIter: iters[i], branchTiming: timings[i] });


				console.log(animProfilesArr+"<---all profiles");
				console.log(":"+totalLeavesToAnim + ":"+branchesToAnim[i]+":"+branchNumOfLeavesToAnim[i]+":  "+
					moveTypes[i]+ "  :" + durations[i]+":"+ delays[i]+":"+ iters[i]+ ":"+ timings[i]+"  ooooooo");


			}
			return animProfilesArr;
		}
		function moveBranch(leafNoArray, animProfile) {
			// move each leaf in branch 
			while (leafNoArray.length > 0) {
				// grab first random leaf on this branch to animate
                console.log("leafnoarray: "+ leafNoArray);
                console.log("length: "+leafNoArray.length);
                let pop = leafNoArray.pop();
				console.log(pop);
				let leafId = "leaf" + pop;
                console.log("leafId"+ leafId);
				// get leaf element 
				let queryLeafId = `#${leafId}`;
				let leaf = document.querySelector(queryLeafId);
				let randomMoveType = Math.floor(Math.random() * animProfile.branchMoveType.length);
				let moveType = animProfile.branchMoveType[randomMoveType];
				// some leaf animation properties are based on branch but slightly randomized to appear unique
				let duration = animProfile.branchDuration + Math.floor(Math.random() * 50);
				let iter = animProfile.branchIter + Math.floor(Math.random() * 1);
				let direction = "alternate-reverse";
				let delay = animProfile.branchDelay + Math.floor(Math.random() * 50);
				let timing = animProfile.branchTiming;
				let fillMode = "both";
				console.log("anim:"+ " mt:" + moveType + " dur:"+ duration + " iter:"+ iter + " direc:"+ direction + " del:"+ delay + " timing:"+ timing+ " flmd:" + fillMode);
				leaf.style.transformStyle = "preserve-3d";
				leaf.style.animation = `${moveType} ${duration}ms ${iter} ${direction} ${delay}ms ${timing} ${fillMode}`;
			}
		}

		//let leavesByBranch = [];
		// To make a breeze:
		// 			-get animation profiles, which is an array indexed by each branch to animate
		//		 		each branch & contains animation objects
		// 			-loop through the branches desired to animate in order...
		// 			    -get array of random leaf numbers for each branch 
		//			        (passing in # total canopy leaves, # leaves to animate, branch#, 
        //                   and list of leaves by branch)
		if ( !(this.isfull)) {
			alert("You need leaves to see a breeze...");
		} else {
			const motherLeafArray = [];
			let copyOfleavesInBranch = [], leavesInThisBranch = [];
			let index = null;
			const animProfiles = getAnimProfiles(this.numLeaves);
			console.log("end canopy arrrrr: "+ this.leavesByBranch);
			console.log("anim profiles:"+animProfiles);
			console.log("animationProfiles[0]"+animProfiles[0]);

			animProfiles.forEach((profile, i) => {
				//	console.log(profile.x);  
				if (profile.branchNumOfLeavesToAnim != 0) {
					console.log("end canopy profile index:"+index+" i:"+i+ " : profile:"+profile+"   ");
					index = profile.branchToAnim;
					console.log("end canopy numleaves: "+this.numLeaves+ "  branch#leavestoanim: "+ profile.branchNumOfLeavesToAnim+ "branchToanim: "+profile.branchToAnim+"  ");
					console.log("  branchtoanim:"+profile.branchToAnim);

					console.log("  leavesByBranch "+ this.leavesByBranch[index]);
					leavesInThisBranch = this.leavesByBranch[index];
					copyOfleavesInBranch = leavesInThisBranch.slice(0);  //make a copy of leaves in branch to preserve orig
					motherLeafArray[i] =
						getLeafNos(profile.branchNumOfLeavesToAnim, profile.branchToAnim, copyOfleavesInBranch);
					console.log("motherleafarray"+motherLeafArray[i]+ "now starting movebranch!");
					moveBranch(motherLeafArray[i], profile);
				} else {
					console.log("skipping this branch, number of leaves = 0");
				}
			});	
		}	
	}
}	//end canopy

const canopy1 = new Canopy(260);

function getLeavesOnTree() {
	canopy1.getLeaves();
}

function mildBreeze() {
	canopy1.breeze("mild");
}

function spraySparkles() {
	alert("<great effect here>");
}


// Event listeners below:

//name events
document.getElementById("name").addEventListener("click", openResume);
document.getElementById("name").addEventListener("mouseover", (event) => { 
	if (event.target.querySelector(".tooltiptext2") != null) {
		event.target.querySelector(".tooltiptext2").style.display = "block";	} });
document.getElementById("name").addEventListener("mouseout", (event) => {
	if (event.target.querySelector(".tooltiptext2") != null) {
		event.target.querySelector(".tooltiptext2").style.display = "none"; 	} });
//phone events
document.querySelector(".phone").addEventListener("mouseover", (event) => { 
	if (event.target.querySelector(".tooltiptext2") != null) {
		event.target.querySelector(".tooltiptext2").style.display = "block";	} });
document.querySelector(".phone").addEventListener("mouseout", (event) => {
	if (event.target.querySelector(".tooltiptext2") != null) {
		event.target.querySelector(".tooltiptext2").style.display = "none"; } });
		document.querySelector(".phone").addEventListener("click", (event) => {
			navigator.clipboard.writeText(event.target.innerText);} );
//email events
document.querySelector(".email").addEventListener("mouseover", (event) => { 
	if (event.target.querySelector(".tooltiptext2") != null) {
		event.target.querySelector(".tooltiptext2").style.display = "block";	} });
document.querySelector(".email").addEventListener("mouseout", (event) => {
	if (event.target.querySelector(".tooltiptext2") != null) {
		event.target.querySelector(".tooltiptext2").style.display = "none"; 	} });
document.querySelector(".email").addEventListener("click", (event) => {
			navigator.clipboard.writeText(event.target.innerText); } );
//other random events
document.getElementById("photo").addEventListener("click", spraySparkles);
document.querySelector(".tree").addEventListener("click", spraySparkles);
document.getElementById("ball").addEventListener("click", ballDrop);
document.getElementById("getleaves").addEventListener("click", getLeavesOnTree);
document.getElementById("mildbreeze").addEventListener("click", mildBreeze);


/* Set event listeners for skills & tooltips:
		open popup box on skill names
		display tooltip for selected items   */
const skills = document.getElementsByClassName("skill-name");
//add listeners for tooltip popups on mouseover and mouseout
for (i=0; i < skills.length; i++) {
	tooltip = skills[i].innerHTML;
	if (skills[i].querySelector(".tooltiptext")) {
		skills[i].addEventListener("mouseover",  (event) => { 
			let tooltipDisplay = event.target.querySelector(".tooltiptext");
			if (tooltipDisplay != null) {
				event.target.querySelector(".tooltiptext").style.display = "block";
			} 
		});
		skills[i].addEventListener("mouseout",  (event) => { 
			let tooltipDisplay = event.target.querySelector(".tooltiptext");
			if (tooltipDisplay != null) {
				event.target.querySelector(".tooltiptext").style.display = "none";
			} 
		});		
	};	
}
//add listeners for tooltip popups on click of skills
for (i=0; i < skills.length; i++) {
	skills[i].addEventListener("click",  (event) => {
		let text = event.target.innerText + "<br><span>" + 
			event.target.nextElementSibling.innerHTML + "</span>";
		const popup = document.getElementById("popup");
		const figure = event.target.nextElementSibling.nextElementSibling;
		if (figure)  text = (text + "<span id=popFig>" + figure.innerHTML + "<span>");
		popup.innerHTML = text;
		if (popup.style.display === "block") {	//close box so you see animation if box already open
			popup.style.display = "none";
			//timeout so you can see new box animation
			setTimeout(() => { popup.style.display = "block";}, 20);
		} else {
		popup.style.display = "block";
		};
	});
}

// event listener to close popup box 
document.querySelector("body").addEventListener("click", (event) => {
	const popup = document.getElementById("popup");
	// close popup box if open and not a selected skill
	if ((popup.style.display === "block") && 
		(event.target.className != "skill-name")) {
		popup.style.display = "none";
	};
});

	

