"use strict";

const container = document.getElementById("calculator-container");
const rawBonesTotalElement = document.getElementById("rawBonesTotalResult");
const baseShardsInput = document.querySelector(".base-shards");
const grandTotalDisplay = document.getElementById("grandTotalBoneShards");
const winesDisplay = document.getElementById("wines");
const experienceDisplay = document.getElementById("experience");
const sunfireExperienceDisplay = document.getElementById("sunfireExperience");

// 1. Listen for inputs and focus across the container and base-shards elements
if (container) {
  container.addEventListener("input", handleInputCalculations);
  container.addEventListener("focusin", handleInputFocus); // Highlights text on click/tab
}
if (baseShardsInput) {
  baseShardsInput.addEventListener("input", handleInputCalculations);
  baseShardsInput.addEventListener("focus", handleInputFocus); // Highlights text on click/tab
}

// 2. Master controller function triggered by ANY input event
function handleInputCalculations(event) {
  // If the changed input belongs to the grid, update its specific row result first
  if (event.target.classList.contains("quantity-input")) {
    const input = event.target;
    const multiplier = Number(input.dataset.multiplier) || 0;
    const resultId = input.dataset.resultId;
    const quantity = Number(input.value) || 0;
    const shardQuantity = quantity * multiplier;

    const resultElement = document.getElementById(resultId);
    if (resultElement) {
      resultElement.textContent = shardQuantity;
    }
  }

  // Run the full cascading recalculation chain
  updateAllTotals();
}

// 3. Centralized calculation engine that updates all totals simultaneously
function updateAllTotals() {
  let rawBonesTotal = 0;

  // Calculate the raw bones subtotal
  if (container) {
    const allResults = container.querySelectorAll('[id$="Result"]');
    allResults.forEach((element) => {
      if (element.id !== "rawBonesTotalResult") {
        rawBonesTotal += Number(element.textContent) || 0;
      }
    });
  }

  // Update Raw Bones Subtotal Display
  if (rawBonesTotalElement) {
    rawBonesTotalElement.textContent = rawBonesTotal.toLocaleString();
  }

  // Calculate and update the ultimate Grand Total
  const baseShards = baseShardsInput ? Number(baseShardsInput.value) || 0 : 0;
  const shardsGrandTotal = baseShards + rawBonesTotal;

  if (grandTotalDisplay) {
    grandTotalDisplay.textContent = shardsGrandTotal.toLocaleString(); // Commas added here too
  }

  const wines = shardsGrandTotal / 200;
  if (winesDisplay) {
    winesDisplay.textContent = wines.toLocaleString(); // Commas added here too
  }

  const exp = shardsGrandTotal * 5;
  if (experienceDisplay) {
    experienceDisplay.textContent = exp.toLocaleString();
  }

  const sunfireExp = shardsGrandTotal * 6;
  if (sunfireExperienceDisplay) {
    sunfireExperienceDisplay.textContent = sunfireExp.toLocaleString();
  }
}

// 4. Reset Button Functionality
const resetButton = document.getElementById("reset-button");

if (resetButton) {
  resetButton.addEventListener("click", () => {
    // Populate all number inputs in the container with 0
    if (container) {
      const inputs = container.querySelectorAll(".quantity-input");
      inputs.forEach((input) => (input.value = 0));
    }

    // Populate the standalone base shards input with 0
    if (baseShardsInput) {
      baseShardsInput.value = 0;
    }

    // Reset all individual row result text elements to 0
    if (container) {
      const results = container.querySelectorAll('[id$="Result"]');
      results.forEach((result) => (result.textContent = "0"));
    }

    // Refresh the master calculation engine
    updateAllTotals();
  });
}

// 5. Highlight text inside inputs automatically when focused
function handleInputFocus(event) {
  if (event.target.tagName === "INPUT") {
    event.target.select();
  }
}
