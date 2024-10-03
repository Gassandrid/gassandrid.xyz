# Final Project Status Update

> [!abstract] Student Information
> Ewan Pedersen
> CS2210
> 9 • 11 • 2024

---

## 1. Summary Of Progress

For now, all of my research has been on the software side of things, as that will be the most challenging part. I have a rough idea of the physical appearance of the DARS machine, but the real work will be designing and fine tuning the LLM behind it.

For the function calling side of things, I have been researching and playing around with [Langroid](https://github.com/langroid/langroid), a specialized tool for structuring and chaining the input/output of Language Models to fit certain tasks.

For my purpose, I have been figuring out how to map LLM output to call GPIO functions that will control hardware in my room, like turning on/off the lights. Whether this is through GPIO directly, or through a wireless medium protocol like ESP32 microcontrollers.

---

## 2. Time Log 

| Date      | Name | Role                   | Description                                                        | Time(Hrs) |
| --------- | ---- | ---------------------- | ------------------------------------------------------------------ | --------- |
| 9/17/2024 | Ewan | Lead Model Engineer    | Researched LANGROID and function calling                           | 3.5       |
| 9/20      | Ewan | Lead Creative Designer | Browsed open source models for most tunable, choosing Llama 3.1 8b | 1.5       |
| 9/20      | Ewan | Lead Creative Designer | Simple cad model for the shell                                     | 0.5       |

---

## 3. Next Steps

Now that I have a general sense of how I want the model architecture to look like, I need to start designing a plan to train the model, not only to share the personality of TARS from interstellar, but to remain reliable at outputting formatted JSON for the function calling aspect. All of this, and to keep in mind the platform in which this model is going to be ran on, and how limited the available compute is.

I should also start looking into online GPU renting solutions, as training the model on my mac is not a viable option.

---

## 4. Challenges

The biggest issue by far is going to be optimization. LLM's require an enormous amount of computer, and even the smallest models on the market (8b parameters) won't run very fast on my Pi alone. For this reason, I will most likely need to purchase a TPU add-on, which adds another layer of complexity and debugging. 

If this doesn't work out, I always have the fallback of running the models through the cloud, and only interacting with them through API's. 

If this doesn't work out, I always have the fallback of running the models through the cloud, and only interacting with them through API's.

If this doesn't work out, I always have the fallback of running the models through the cloud, and only interacting with them through API's. This isn't nearly as impressive as my main plan, but will mean the model will perform a lot better and be a lot more capable, however with some ethical barriers in place (I can't make the LLM have a sense of Humor!).