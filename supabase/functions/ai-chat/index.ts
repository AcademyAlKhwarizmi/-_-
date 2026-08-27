import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response(JSON.stringify({error:"POST only"}), {status:405,headers:cors});

  try {
    const { message, video, subject = "رياضيات", language = "ar" } = await req.json();
    if (!message?.trim()) return new Response(JSON.stringify({error:"message is required"}), {status:400,headers:cors});

    const key = Deno.env.get("GEMINI_API_KEY");
    if (!key) return new Response(JSON.stringify({error:"GEMINI_API_KEY is missing"}), {status:500,headers:cors});

    const context = video ? `الطالب يسأل داخل فيديو بعنوان: ${video}. اربط إجابتك بهذا السياق ولا تدّعي أنك ترى الفيديو إلا إذا أُرسل نصه.` : "لا يوجد فيديو محدد.";
    const system = `أنت الخوارزمي AI، مدرس رياضيات عربي لطلاب الإعدادي والثانوي. ${context}
اشرح بالعربية وبأسلوب بسيط. في المسائل، ابدأ بالفكرة ثم الخطوات ثم النتيجة، وشجع الطالب على الفهم. لا تخترع محتوى فيديو أو PDF غير مُرسل لك. الموضوع المسموح: الرياضيات فقط.`;

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        system_instruction: {parts:[{text:system}]},
        contents: [{role:"user",parts:[{text:`${subject} / ${language}\n${message}` }]}],
        generationConfig: {temperature:0.35, maxOutputTokens:1200}
      })
    });

    const data = await r.json();
    if (!r.ok) return new Response(JSON.stringify({error:data?.error?.message || "Gemini request failed"}), {status:502,headers:cors});

    const reply = data?.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||"").join("") || "لم أستطع تكوين رد الآن.";
    return new Response(JSON.stringify({reply}), {headers:cors});
  } catch (e) {
    return new Response(JSON.stringify({error:String(e)}), {status:500,headers:cors});
  }
});
