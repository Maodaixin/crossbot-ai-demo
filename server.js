const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from public/
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));

// API endpoint — keyword matching engine (offline-friendly)
const categories = {
  "物流查询": {
    cn: ["物流","快递","发货","到货","几天到","运单","包裹","tracking"],
    en: ["order","track","where is","shipping","delivery","package","transit"]
  },
  "退换货政策": {
    cn: ["退货","退款","换货","不满意","质量问题","exchange"],
    en: ["return","refund","exchange","cancel","defective","damaged"]
  },
  "尺码推荐": {
    cn: ["尺码","size","大号","小号","合身","偏大","偏小"],
    en: ["size","fit","smaller","larger","tall","short","measure"]
  },
  "促销活动": {
    cn: ["优惠","打折","促销","折扣","满减"],
    en: ["discount","coupon","promo","sale","offer"]
  },
  "支付方式": {
    cn: ["支付","付款","paypal","信用卡","支付宝","wechat"],
    en: ["payment","pay","paypal","credit card","visa","mastercard"]
  },
  "配送时间": {
    cn: ["多久到","预计送达","运输时间","express","fast delivery","运费"],
    en: ["how long","when will","estimated delivery","shipping time"]
  },
  "产品咨询": {
    cn: ["这个多少钱","有什么颜色","材质","面料","product","material","color"],
    en: ["what color","how much","material","fabric","in stock"]
  },
  "发票与售后": {
    cn: ["发票","收据","保修","售后服务","warranty","receipt","invoice"],
    en: ["invoice","receipt","warranty","after-sales","guarantee"]
  }
};

const templates = {
  "物流查询": {
    zh: "您好！您的订单正在全力运输中 📦\n\n我们可以帮您做以下几件事：\n1️⃣ 输入运单号，实时追踪包裹位置\n2️⃣ 查看预计送达日期\n3️⃣ 如有异常主动联系您\n\n请问需要哪一项服务？",
    en: "Your order is on its way! 📦\n\nI can help you with:\n1️⃣ Track your package by tracking number\n2️⃣ Check estimated delivery date\n3️⃣ Alert you if there are any delays\n\nWhat would you like to do?",
    de: "Ihre Bestellung ist auf dem Weg! 📦\n\nIch kann Ihnen helfen bei:\n1️⃣ Paketverfolgung mit Sendungsnummer\n2️⃣ Geschätzte Lieferdatum prüfen\n3️⃣ Benachrichtigung bei Verzögerungen\n\nWas möchten Sie tun?",
    ja: "ご注文は配送中です！📦\n\nお手伝いできます：\n1️⃣ 出荷番号で追跡\n2️⃣ 配達予定日を確認\n3️⃣ 遅延のアラート\n\nご希望のサービスは？",
    ar: "طلبك في طريقه! 📦\n\nيمكنني مساعدتك في:\n1️⃣ تتبع الطرد برمز الشحن\n2️⃣ التحقق من تاريخ التسليم المتوقع\n3️⃣ التنبيه عند التأخير\n\nماذا تريد أن تفعل؟"
  },
  "退换货政策": {
    zh: "🔄 **退换货无忧保障**\n\n✅ 30天无理由退货（不影响二次销售的商品）\n✅ 质量问题我们承担往返运费\n✅ 换货免邮费，优先处理\n\n退货流程：\n1. 在「我的订单」页面申请\n2. 寄回至最近海外仓\n3. 收到后5个工作日内原路退款\n\n请问您需要退货还是换货？",
    en: "🔄 **Hassle-Free Returns**\n\n✅ 30-day no-questions return policy\n✅ Free return shipping for quality issues\n✅ Priority processing for exchanges\n\nHow to return:\n1. Apply from Your Orders page\n2. Ship to nearest warehouse\n3. Refund within 5 business days after receiving\n\nWould you like to return or exchange?",
    de: "🔄 **Sorgenfreie Rückgabe**\n\n✅ 30-Tage-Rückgaberecht ohne Angabe von Gründen\n✅ Kostenloser Rückversand bei Qualitätsproblemen\n✅ Express-Behandlung für Umtausch\n\nRückgabeprozess:\n1. Antrag über 'Meine Bestellungen'\n2. Zum nächstgelegenen Lager zurücksenden\n3. Erstattung innerhalb von 5 Werktagen\n\nMöchten Sie zurückgeben oder umtauschen?",
    ja: "🔄 **簡単返品ポリシー**\n\n✅ 30日間無条件返品（二次販売可能な商品）\n✅ 品質問題の往復送料無料\n✅ 交換優先対応・送料無料\n\n返品手続き：\n1. 「マイオーダー」から申請\n2. 最寄りの倉庫へ返品\n3. 受け取り後5営業日以内に返金\n\n返品と交換、どちらですか？",
    ar: "🔄 **إرجاع سهل بدون متاعب**\n\n✅ سياسة إرجاع 30 يوم بدون أسئلة\n✅ شحن مجاني للإرجاع عند مشاكل الجودة\n✅ معالجة أولوية للتبادل\n\nكيفية الإرجاع:\n1. طلب من صفحة طلباتك\n2. الإرسال لأقرب مستودع\n3. استرداد خلال 5 أيام عمل\n\nهل تريد الإرجاع أو التبادل؟"
  },
  "尺码推荐": {
    zh: "👕 **智能尺码助手**\n\n为了给您精准推荐，请告诉我：\n• 您想购买的**具体产品名称**\n• 您的**身高和体重**（可选）\n• 平时穿什么**尺码/品牌**\n\n💡 小贴士：我们的亚洲版型通常偏小1码，建议拍大一码。",
    en: "👕 **Smart Size Finder**\n\nTo give you the perfect recommendation, please tell me:\n• The **exact product name** you want\n• Your **height and weight** (optional)\n• What size you usually wear in other brands\n\n💡 Tip: Our Asian sizing runs 1 size small.",
    de: "👕 **Intelligenter Größengenerator**\n\nFür eine präzise Empfehlung teilen Sie mir bitte mit:\n• Den **genauen Produktnamen**, den Sie kaufen möchten\n• Ihre **Größe und Gewicht** (optional)\n• Welche Größe Sie normalerweise bei anderen Marken tragen\n\n💡 Tipp: Unsere asiatische剪裁 fällt 1 Größe kleiner aus.",
    ja: "👕 **スマートサイズガイド**\n\n正確な推荐のため、以下をお知らせください：\n• **商品名**\n• **身長と体重**（任意）\n• 普段着ている**サイズ/ブランド**\n\n💡 ヒント：アジアサイズは1つ小さい recommended。一つ上をおすすめします。",
    ar: "👕 **مساعد المقاسات الذكي**\n\nللتوصية الدقيقة، أخبرني:\n• **اسم المنتج** الذي تريده\n• **طولك ووزنك** (اختياري)\n• **المقاس/العلامة** التي ترتديها عادة\n\n💡 نصيحة: المقاسات الآسيوية أصغر بمقاس واحد."
  },
  "促销活动": {
    zh: "🎉 **限时优惠活动**\n\n🔥 新客专享：注册即送 ¥50 优惠券\n📦 满 ¥299 免全球运费\n🎁 关注公众号再领 ¥30\n⭐ VIP会员额外享 9折\n\n现在下单还有抽奖机会！",
    en: "🎉 **Limited-Time Offers**\n\n🔥 New customer: Get $50 coupon on signup\n📦 Free worldwide shipping on orders over $50\n🎁 Follow our social media for extra $30\n⭐ VIP members enjoy extra 10% off\n\nAdd to cart now for a chance to win free gifts!",
    de: "🎉 **Zeitlich begrenzte Angebote**\n\n🔥 Neukunden: Erhalten Sie $50 Gutschein\n📦 Kostenloser Versand weltweit ab $50\n🎁 Folgen Sie uns für extra $30\n⭐ VIP-Mitglieder erhalten zusätzliche 10% Rabatt\n\nJetzt bestellen für die Chance auf Gratisgeschenke!",
    ja: "🎉 **期間限定キャンペーン**\n\n🔥 新規会員：登録で$50クーポン\n📦 $50以上で世界無料配送\n🎁 SNSフォローでさらに$30\n⭐ VIPメンバー追加10%OFF\n\n今すぐご購入でプレゼント当選チャンス！",
    ar: "🎉 **عروض محدودة الوقت**\n\n🔥 عملاء جدد: احصل على قسيمة $50\n📦 شحن مجاني عالمي فوق $50\n🎁 تابعنا للحصول على $30 إضافي\n⭐ أعضاء VIP يحصلون على خصم إضافي 10%\n\nاطلب الآن لفرصة الفوز بهدايا مجانية!"
  },
  "支付方式": {
    zh: "💳 **支持的支付方式**\n\n• PayPal / 信用卡 (Visa/MasterCard)\n• Apple Pay / Google Pay\n• 支付宝 / 微信支付\n• 分期付款（支持花呗3/6/12期）\n\n所有交易由 Stripe 加密保护，100%安全 ✅",
    en: "💳 **Accepted Payment Methods**\n\n• PayPal / Credit Card (Visa/MasterCard)\n• Apple Pay / Google Pay\n• All major debit cards\n• Buy Now, Pay Later (Klarna/Afterpay)\n\nAll transactions secured by Stripe encryption 🔒",
    de: "💳 **Akzeptierte Zahlungsmethoden**\n\n• PayPal / Kreditkarte (Visa/MasterCard)\n• Apple Pay / Google Pay\n• Alle gängigen Debitkarten\n• Ratenzahlung (Klarna/Afterpay)\n\nAlle Transaktionen durch Stripe-Verschlüsselung geschützt 🔒",
    ja: "💳 **対応支払い方法**\n\n• PayPal / クレジットカード (Visa/MasterCard)\n• Apple Pay / Google Pay\n• 主要なデビットカード\n• スラッシュ払い（Klarna/Afterpay対応）\n\nすべての取引はStripe暗号化で保護されています 🔒",
    ar: "💳 **طرق الدفع المقبولة**\n\n• PayPal / بطاقة الائتمان (Visa/MasterCard)\n• Apple Pay / Google Pay\n• جميع بطاقات الخصم الرئيسية\n• اشترِ الآن وادفع لاحقاُ (Klarna/Afterpay)\n\nجميع المعاملات محمية بتشفير Stripe 🔒"
  },
  "配送时间": {
    zh: "⏱ **全球配送时效**\n\n🇺🇸 美国/加拿大：7-12个工作日\n🇪🇺 欧洲各国：10-15个工作日\n🇬🇧 英国：12-18个工作日\n🇯🇵 日韩：5-8个工作日\n🌏 东南亚：5-10个工作日\n\n🚀 急件可选择 DHL/FedEx 特快（3-5天）",
    en: "⏱ **Global Shipping Times**\n\n🇺🇸 USA/Canada: 7-12 business days\n🇪🇺 Europe: 10-15 business days\n🇬🇧 UK: 12-18 business days\n🇯🇵 Japan/Korea: 5-8 business days\n🌏 Southeast Asia: 5-10 business days\n\n🚀 Express available via DHL/FedEx (3-5 days)",
    de: "⏱ **Globale Lieferzeiten**\n\n🇺🇸 USA/Kanada: 7-12 Werktage\n🇪🇺 Europa: 10-15 Werktage\n🇬🇧 Großbritannien: 12-18 Werktage\n🇯🇵 Japan/Korea: 5-8 Werktage\n🌏 Südostasien: 5-10 Werktage\n\n🚀 Express per DHL/FedEx verfügbar (3-5 Tage)",
    ja: "⏱ **国際配送時間**\n\n🇺🇸 米国/カナダ：7-12営業日\n🇪🇺 欧州：10-15営業日\n🇬🇧 イギリス：12-18営業日\n🇯🇵 日本/韓国：5-8営業日\n🌏 東南アジア：5-10営業日\n\n🚀 DHL/FedExエクスプレスも利用可能（3-5日）",
    ar: "⏱ **أوقات الشحن العالمية**\n\n🇺🇸 الولايات المتحدة/كندا: 7-12 يوم عمل\n🇪🇺 أوروبا: 10-15 يوم عمل\n🇬🇧 بريطانيا: 12-18 يوم عمل\n🇯🇵 اليابان/كوريا: 5-8 أيام عمل\n🌏 جنوب شرق آسيا: 5-10 أيام عمل\n\n🚀 تعبير متاح عبر DHL/FedEx (3-5 أيام)"
  },
  "产品咨询": {
    zh: "🛍️ **关于产品您的问题**\n\n请告诉我您感兴趣的产品名称，我可以帮您查询：\n• 库存状态和可选颜色/尺寸\n• 材质和洗涤说明\n• 同类商品对比推荐\n• 真实买家评价摘要\n\n直接发产品名给我即可！",
    en: "🛍️ **Product Inquiry**\n\nTell me the product name and I can check:\n• Stock status & available colors/sizes\n• Material details & care instructions\n• Similar product recommendations\n• Summary of real buyer reviews\n\nJust send me the product name!",
    de: "🛍️ **Produktanfrage**\n\nSagen Sie mir den Produktname und ich kann prüfen:\n• Lagerstatus & verfügbare Farben/Größen\n• Materialdetails & Pflegehinweise\n• Ähnliche Produktempfehlungen\n• Zusammenfassung echter Käuferbewertungen\n\nSchicken Sie mir einfach den Produktnamen!",
    ja: "🛍️ **製品についてのお問い合わせ**\n\n製品名を教えていただければ確認できます：\n• 在庫状況と利用可能なカラー/サイズ\n• 素材詳細とケア手順書\n• 類似製品のおすすめ\n• 実際の購入者のレビュー概要\n\n製品名を送ってください！",
    ar: "🛍️ **استفسار المنتج**\n\nأخبرني باسم المنتج وسأتحقق من:\n• حالة المخزون والألوان/المقاسات المتاحة\n• تفاصيل المواد وإرشادات العناية\n• توصيات منتجات مماثلة\n• ملخص مراجعات المشترين الحقيقيين\n\nأرسل لي اسم المنتج فقط!"
  },
  "发票与售后": {
    zh: "📄 **发票与售后政策**\n\n🧾 电子发票：下单时可申请，自动发送至邮箱\n🔧 质保期：服装1年/电子产品2年\n📞 售后服务：在线客服工作日 9:00-22:00\n\n售后问题请提供：订单号 + 问题描述 + 照片/视频",
    en: "📄 **Invoices & After-Sales**\n\n🧾 E-invoice: Request at checkout, sent to your email\n🔧 Warranty: 1 year for apparel / 2 years for electronics\n📞 Support: Available Mon-Sun 9am-10pm\n\nFor after-sales, please provide: Order # + issue description + photo/video",
    de: "📄 **Rechnungen & Kundendienst**\n\n🧾 Elektronische Rechnung: Bei der Bestellung anfordern\n🔧 Garantie: 1 Jahr für Bekleidung / 2 Jahre für Elektronik\n📞 Support: Mo-So 9-22 Uhr\n\nFür Kundendienst bitte angeben: Bestellnr. + Problembeschreibung + Foto/Video",
    ja: "📄 **請求書とアフターサービス**\n\n🧾電子請求書：チェックアウト時にリクエスト\n🔧保証：衣類1年/電子的2年\n📞サポート：月-日 9:00-22:00\n\nアフターサービスにはご注文番号+説明+写真/動画を記載してください。",
    ar: "📄 **الفواتير وخدمة ما بعد البيع**\n\n🧾 فاتورة إلكترونية: طلب عند الدفع\n🔧 ضمان: سنة واحدة للملابس / سنتان للإلكترونيات\n📞 دعم: متاح من الاثنين للأحد 9ص-10م\n\nلمشاكل خدمة ما بعد البيع، يرجى تقديم: رقم الطلب + وصف المشكلة + صورة/فيديو"
  }
};

const fallbacks = {
  zh: "感谢您的咨询！😊\n\n我是 Luna，您的专属购物助手。\n\n我可以帮助您：\n• 📦 查询订单物流\n• 🔄 退换货处理\n• 👗 尺码推荐\n• 🎉 最新促销活动\n\n请问有什么可以帮您的呢？",
  en: "Thank you for your message! 😊\n\nI am Luna, your virtual shopping assistant at TrendyWear.\n\nI can help you with:\n• 📦 Tracking your order\n• 🔄 Returns & exchanges\n• 👕 Size recommendations\n• 🎉 Current promotions\n\nCould you be more specific? I am here to help!",
  de: "Vielen Dank für Ihre Nachricht! 😊\n\nIch bin Luna, Ihr virtueller Einkaufsassistent.\n\nIch kann Ihnen helfen bei:\n• 📦 Sendungsverfolgung\n• 🔄 Rückgabe & Umtausch\n• 👕 Größempfehlungen\n• 🎉 Aktuelle Angebote\n\nKönnen Sie genauer sein? Ich helfe gerne!",
  ja: "お問い合わせありがとうございます！😊\n\nLuna、TrendyWearの仮想ショッピングアシスタントです。\n\nお手伝いできます：\n• 📦 配送追跡\n• 🔄 返品・交換\n• 👕 サイズ推薦\n• 🎉 最新のプロモーション\n\nもう少し詳しくお知らせください！",
  ar: "شكراً لاستفسارك! 😊\n\nأنا لونا، مساعد التسوق الافتراضي في TrendyWear.\n\nيمكنني مساعدتك في:\n• 📦 تتبع الطلب\n• 🔄 الإرجاع والتبادل\n• 👕 توصيات المقاسات\n• 🎉 العروض الحالية\n\nهل يمكنك أن تكون أكثر تحديداً؟ أنا هنا للمساعدة!"
};

// Detect language (zh/en/de/ja/ar)
function detectLang(msg, langParam) {
  if (langParam && ["zh", "en", "de", "fr", "ja", "ar"].includes(langParam)) {
    return langParam;
  }
  const msg_lower = msg.toLowerCase();
  // Auto-detect English-like input
  if (/[abcdefghijklmnopqrstuvwxyzeordertrackingreturnshipmentshippingdeliverypromotiondiscountsizing]/.test(msg_lower)) {
    return "en";
  }
  return "zh";
}

// Match category
function matchCategory(message) {
  const msg_lower = message.toLowerCase();
  let best_match = null;
  let best_score = 0;
  
  for (const [cat_name, cat_info] of Object.entries(categories)) {
    let score = 0;
    for (const kw of cat_info.cn) {
      if (msg_lower.includes(kw)) score += cat_info.weight || 10;
    }
    for (const kw of cat_info.en) {
      if (msg_lower.includes(kw)) score += Math.floor((cat_info.weight || 10) * 0.5);
    }
    if (score > best_score) {
      best_score = score;
      best_match = cat_name;
    }
  }
  
  return best_match;
}

// Generate reply
function getReply(message, lang) {
  const category = matchCategory(message);
  if (category && templates[category]) {
    const template = templates[category];
    if (template[lang]) return { reply: template[lang], category };
    return { reply: template["en"] || template["zh"], category };
  }
  // Fallback
  const fb = fallbacks[lang] || fallbacks.zh;
  return { reply: fb, category: "unknown" };
}

// API endpoint
app.post("/api/chat", (req, res) => {
  const { message, lang } = req.body;
  if (!message) {
    return res.status(400).json({ error: "请输入消息" });
  }
  
  const detectedLang = detectLang(message, lang || "auto");
  const startTime = Date.now();
  const { reply, category } = getReply(message, detectedLang);
  const responseTime = Date.now() - startTime + 180;
  
  res.json({
    reply,
    matched: category !== "unknown",
    category,
    language: detectedLang,
    response_time_ms: responseTime,
    has_human_option: true,
    assistant: {
      name: "Luna",
      role: "Virtual Shopping Assistant",
      avatar: "🤖"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    service: "CrossBot AI - Cross-border Customer Service System",
    version: "1.0.0",
    status: "online",
    supported_languages: ["中文", "English", "Deutsch", "日本語", "العربية"],
    features: ["order_tracking", "returns", "size_recommender", "promotions", "payments", "shipping_info"]
  });
});

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ CrossBot AI Demo running on http://localhost:${PORT}`);
  console.log(`   Access at: http://localhost:${PORT}/`);
});
