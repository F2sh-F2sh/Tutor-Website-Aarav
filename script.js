console.log("Website loaded");

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://bzcarceljgdwdqlcbotl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_VNz-PocQFPrNjsap1Asw2g_s7-AkKb4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const reviewsDiv = document.getElementById("reviews");
const form = document.getElementById("review-form");
const message = document.getElementById("review-message");

async function loadReviews() {
    const { data, error } = await supabase
        .from("reviews")
        .select("reviewer_name, comment, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        reviewsDiv.innerHTML = "<p>Could not load reviews.</p>";
        return;
    }

    if (!data || data.length === 0) {
        reviewsDiv.innerHTML = "<p>No reviews yet.</p>";
        return;
    }

    reviewsDiv.innerHTML = data.map(review => `
        <div class="review">
            <strong>${escapeHtml(review.reviewer_name)}</strong>
            <p>${escapeHtml(review.comment)}</p>
        </div>
    `).join("");
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const reviewerName = document.getElementById("reviewer-name").value.trim();
    const comment = document.getElementById("comment").value.trim();

    const { error } = await supabase
        .from("reviews")
        .insert({
            reviewer_name: reviewerName,
            comment: comment,
            is_approved: false
        });

    if (error) {
        console.error(error);
        message.textContent = "Sorry, your review could not be submitted.";
        return;
    }

    form.reset();
    message.textContent = "Thank you! Your review will appear after approval.";
});

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadReviews();
