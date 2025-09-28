// Get all needed DOM elements
const form = document.getElementById("checkForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;

// Load counts and attendee list from localStorage on page load
window.addEventListener("DOMContentLoaded", function () {
  // Load total count
  const savedCount = localStorage.getItem("attendanceCount");
  if (savedCount !== null) {
    count = parseInt(savedCount);
    const attendeeCount = document.getElementById("attendeeCount");
    if (attendeeCount) {
      attendeeCount.textContent = count;
    }
    const percentage = Math.round((count / maxCount) * 100);
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
  }
  // Load team counts
  const teams = ["water", "zero", "power"];
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const savedTeamCount = localStorage.getItem(team + "Count");
    if (savedTeamCount !== null) {
      const teamCounter = document.getElementById(team + "Count");
      if (teamCounter) {
        teamCounter.textContent = savedTeamCount;
      }
    }
  }

  // Load attendee list
  const savedAttendees = localStorage.getItem("attendeeList");
  if (savedAttendees) {
    const attendees = JSON.parse(savedAttendees);
    for (let i = 0; i < attendees.length; i++) {
      addAttendeeToList(attendees[i].name, attendees[i].teamName, true);
    }
  }

  // Disable check-in button if attendance is full
  const checkInBtn = document.getElementById("checkInBtn");
  if (count >= maxCount && checkInBtn) {
    checkInBtn.disabled = true;
    checkInBtn.style.opacity = "0.6";
    checkInBtn.style.cursor = "not-allowed";
  }
});

// Handle form submission
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment count
  count++;
  // Save total count to localStorage
  localStorage.setItem("attendanceCount", count);

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100);
  console.log(`Progress: ${percentage}%`);

  // Update progress bar width
  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }

  // Update attendee count display
  const attendeeCount = document.getElementById("attendeeCount");
  if (attendeeCount) {
    attendeeCount.textContent = count;
  }

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  const newTeamCount = parseInt(teamCounter.textContent) + 1;
  teamCounter.textContent = newTeamCount;
  // Save team count to localStorage
  localStorage.setItem(team + "Count", newTeamCount);

  // Show welcome message
  const message = `🎉 Welcome, ${name} from ${teamName}!`;
  console.log(message);

  // Display greeting in the page
  const greeting = document.getElementById("greeting");
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  // Show confetti animation
  showConfetti();

  // Add attendee to the attendee list
  addAttendeeToList(name, teamName);

  // Show celebration message if goal reached and not already shown
  if (count === maxCount && !celebrationShown) {
    showCelebrationMessage();
    celebrationShown = true;
    // Disable check-in button
    const checkInBtn = document.getElementById("checkInBtn");
    if (checkInBtn) {
      checkInBtn.disabled = true;
      checkInBtn.style.opacity = "0.6";
      checkInBtn.style.cursor = "not-allowed";
    }
  }

  // Reset form
  checkInForm.reset();
});

// Add confetti animation function
function showConfetti() {
  const colors = [
    "#00c7fd",
    "#0071c5",
    "#00aeef",
    "#ecfdf3",
    "#e8f7fc",
    "#fff7ed",
    "#ffb347",
    "#ff6961",
  ];
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti";
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 24; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti-piece";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-20px";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(confetti);
  }

  setTimeout(function () {
    confettiContainer.remove();
  }, 1800);
}

// Add attendee list function
function addAttendeeToList(name, teamName, skipSave) {
  let attendeeList = document.getElementById("attendeeList");
  if (!attendeeList) {
    attendeeList = document.createElement("div");
    attendeeList.id = "attendeeList";
    attendeeList.style.marginTop = "30px";
    attendeeList.style.textAlign = "left";
    attendeeList.innerHTML =
      "<h3 style='color:#64748b;font-size:16px;margin-bottom:12px;'>Attendee List</h3><ul style='list-style:none;padding-left:0;margin-bottom:0;'></ul>";
    // Insert after team stats if present, else at end of container
    const teamStats = document.querySelector(".team-stats");
    if (teamStats && teamStats.parentNode) {
      teamStats.parentNode.insertBefore(attendeeList, teamStats.nextSibling);
    } else {
      const container = document.querySelector(".container");
      if (container) {
        container.appendChild(attendeeList);
      }
    }
  }
  const ul = attendeeList.querySelector("ul");
  const li = document.createElement("li");
  li.style.padding = "7px 0";
  li.style.borderBottom = "1px solid #f1f5f9";
  li.style.fontSize = "15px";
  li.innerHTML = `<span style="font-weight:500;color:#475569;">${name}</span> <span style="color:#64748b;">(${teamName})</span>`;
  ul.appendChild(li);

  // Save attendee to localStorage unless restoring
  if (!skipSave) {
    let attendees = [];
    const savedAttendees = localStorage.getItem("attendeeList");
    if (savedAttendees) {
      attendees = JSON.parse(savedAttendees);
    }
    attendees.push({ name: name, teamName: teamName });
    localStorage.setItem("attendeeList", JSON.stringify(attendees));
  }
}

let celebrationShown = false;

function showCelebrationMessage() {
  // Get team counts
  const waterCount = parseInt(
    document.getElementById("waterCount").textContent
  );
  const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
  const powerCount = parseInt(
    document.getElementById("powerCount").textContent
  );

  // Find winning team
  let winningTeam = "";
  let winningEmoji = "";
  if (waterCount >= zeroCount && waterCount >= powerCount) {
    winningTeam = "Team Water Wise";
    winningEmoji = "🌊";
  } else if (zeroCount >= waterCount && zeroCount >= powerCount) {
    winningTeam = "Team Net Zero";
    winningEmoji = "🌿";
  } else {
    winningTeam = "Team Renewables";
    winningEmoji = "⚡";
  }

  // Create celebration message
  let celebration = document.getElementById("celebrationMessage");
  if (!celebration) {
    celebration = document.createElement("div");
    celebration.id = "celebrationMessage";
    celebration.style.background = "#e8f4fc";
    celebration.style.color = "#003c71";
    celebration.style.fontWeight = "600";
    celebration.style.fontSize = "20px";
    celebration.style.padding = "18px";
    celebration.style.borderRadius = "10px";
    celebration.style.marginBottom = "18px";
    celebration.style.textAlign = "center";
    celebration.style.boxShadow = "0 0 18px 2px #00c7fd";
    // Insert above check-in form
    const container = document.querySelector(".container");
    const checkInFormElem = document.getElementById("checkInForm");
    if (container && checkInFormElem) {
      container.insertBefore(celebration, checkInFormElem);
    }
  }
  celebration.textContent = `🏆 Congratulations! ${winningEmoji} ${winningTeam} has the most attendees!`;
}

// Add reset storage function
function resetAttendance() {
  localStorage.clear();
  count = 0;
  const attendeeCount = document.getElementById("attendeeCount");
  if (attendeeCount) {
    attendeeCount.textContent = "0";
  }
  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    progressBar.style.width = "0%";
  }
  const teams = ["water", "zero", "power"];
  for (let i = 0; i < teams.length; i++) {
    const teamCounter = document.getElementById(teams[i] + "Count");
    if (teamCounter) {
      teamCounter.textContent = "0";
    }
  }
  // Remove attendee list
  const attendeeList = document.getElementById("attendeeList");
  if (attendeeList && attendeeList.parentNode) {
    attendeeList.parentNode.removeChild(attendeeList);
  }
  // Remove celebration message
  const celebration = document.getElementById("celebrationMessage");
  if (celebration && celebration.parentNode) {
    celebration.parentNode.removeChild(celebration);
  }
  // Hide greeting
  const greeting = document.getElementById("greeting");
  if (greeting) {
    greeting.textContent = "";
    greeting.style.display = "none";
  }
  celebrationShown = false;

  // Enable check-in button
  const checkInBtn = document.getElementById("checkInBtn");
  if (checkInBtn) {
    checkInBtn.disabled = false;
    checkInBtn.style.opacity = "1";
    checkInBtn.style.cursor = "pointer";
  }
}

// Listen for reset button click
window.addEventListener("DOMContentLoaded", function () {
  // ...existing code...
  const resetBtn = document.getElementById("resetAttendanceBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      resetAttendance();
    });
  }
});
