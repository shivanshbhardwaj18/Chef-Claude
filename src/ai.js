const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_KEY;

export async function getRecipeFromMistral(ingredientsArr,instruction="") {
    const ingredientsString = ingredientsArr.join(", ");

    const prompt = `You are an assistant that receives a list of ingredients: ${ingredientsString} and suggests a recipe using some or all of those ingredients.${instruction} The recipe can include extra ingredients but try to keep it simple. Format your response in markdown: start with a natural recipe name or description, followed by a list of ingredients and instructions. Avoid using header like "Title —keep the response conversational and easy to read in a Humane manner`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct", // or "openai/gpt-3.5-turbo"
                messages: [
                    { role: "system", content: "You suggest recipes using ingredients." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "Sorry, no recipe was generated.";
    } catch (err) {
        console.error("Error fetching recipe:", err.message);
        return "Sorry, something went wrong while fetching the recipe.";
    }
}
