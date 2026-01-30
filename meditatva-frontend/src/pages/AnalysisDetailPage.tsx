import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, Share2, Printer, AlertCircle, CheckCircle, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface AnalysisData {
  reportName: string;
  uploadDate: string;
  confidence: string;
}

interface LabResult {
  name: string;
  value: number;
  unit: string;
  minNormal: number;
  maxNormal: number;
  severity: "normal" | "warning" | "critical";
  icon: string;
  description: string;
}

interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  email: string;
  phone: string;
  lastCheckup: string;
}

const AnalysisDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysisData = location.state?.analysis || null;

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "patient-info",
    "lab-results",
  ]);

  // Mock Patient Information
  const patientInfo: PatientInfo = {
    name: "Rajesh Kumar",
    age: 35,
    gender: "Male",
    bloodType: "O+",
    email: "patient@meditatva.com",
    phone: "+91-9876543210",
    lastCheckup: "15 Jan 2025",
  };

  // Mock Lab Results with Reference Ranges
  const labResults: LabResult[] = [
    {
      name: "Hemoglobin",
      value: 14.5,
      unit: "g/dL",
      minNormal: 13.5,
      maxNormal: 17.5,
      severity: "normal",
      icon: "🩸",
      description: "Oxygen-carrying protein in blood cells",
    },
    {
      name: "Glucose (Fasting)",
      value: 118,
      unit: "mg/dL",
      minNormal: 70,
      maxNormal: 100,
      severity: "warning",
      icon: "🩸",
      description: "Blood sugar level - slightly elevated",
    },
    {
      name: "Total Cholesterol",
      value: 245,
      unit: "mg/dL",
      minNormal: 0,
      maxNormal: 200,
      severity: "warning",
      icon: "🧪",
      description: "Total blood cholesterol - needs attention",
    },
    {
      name: "LDL Cholesterol",
      value: 165,
      unit: "mg/dL",
      minNormal: 0,
      maxNormal: 100,
      severity: "warning",
      icon: "🧪",
      description: "Bad cholesterol - elevated",
    },
    {
      name: "HDL Cholesterol",
      value: 38,
      unit: "mg/dL",
      minNormal: 40,
      maxNormal: 200,
      severity: "warning",
      icon: "🧪",
      description: "Good cholesterol - low",
    },
    {
      name: "Triglycerides",
      value: 280,
      unit: "mg/dL",
      minNormal: 0,
      maxNormal: 150,
      severity: "critical",
      icon: "🧬",
      description: "Blood fats - SIGNIFICANTLY ELEVATED",
    },
    {
      name: "TSH",
      value: 2.1,
      unit: "mIU/L",
      minNormal: 0.4,
      maxNormal: 4.0,
      severity: "normal",
      icon: "🧬",
      description: "Thyroid function - normal",
    },
    {
      name: "Vitamin D",
      value: 22,
      unit: "ng/mL",
      minNormal: 30,
      maxNormal: 100,
      severity: "warning",
      icon: "☀️",
      description: "Vitamin D level - deficient",
    },
    {
      name: "Creatinine",
      value: 0.9,
      unit: "mg/dL",
      minNormal: 0.7,
      maxNormal: 1.3,
      severity: "normal",
      icon: "🫘",
      description: "Kidney function - normal",
    },
    {
      name: "ALT (SGPT)",
      value: 28,
      unit: "U/L",
      minNormal: 7,
      maxNormal: 56,
      severity: "normal",
      icon: "🫘",
      description: "Liver enzyme - normal",
    },
  ];

  const getResultStatus = (lab: LabResult) => {
    if (lab.severity === "critical")
      return "🚨 CRITICAL - Contact Doctor Immediately";
    if (lab.severity === "warning") return "⚠️ WARNING - Needs Attention";
    return "✅ NORMAL";
  };

  const getAIRecommendations = () => {
    const criticalCount = labResults.filter(
      (l) => l.severity === "critical"
    ).length;
    const warningCount = labResults.filter(
      (l) => l.severity === "warning"
    ).length;

    return {
      critical:
        criticalCount > 0
          ? `Your report shows ${criticalCount} critical value(s). PLEASE CONTACT YOUR DOCTOR IMMEDIATELY for professional medical guidance.`
          : "",
      improvements: [
        "🥗 Reduce dietary fat intake - avoid fried foods, oils, and butter",
        "🏃 Increase physical activity to 30 minutes daily (brisk walking, jogging)",
        "☀️ Supplement Vitamin D - spend 20-30 mins in morning sunlight daily",
        "🍎 Increase soluble fiber - add oats, apples, beans to diet",
        "⚕️ Reduce refined sugars - replace with whole grains",
        "💧 Drink 8-10 glasses of water daily",
        "😴 Sleep 7-9 hours nightly for metabolic health",
        "⚖️ Maintain healthy weight through balanced diet and exercise",
      ],
      urgency:
        criticalCount > 0
          ? "Multiple critical values detected. Contact your doctor immediately."
          : warningCount >= 3
          ? "Multiple warning levels detected. Schedule appointment with your doctor within 1-2 weeks."
          : warningCount > 0
          ? "Mild abnormalities detected. Follow-up in 2-4 weeks."
          : "All values normal. Continue regular health checkups.",
    };
  };
  
  const getSeverityRank = (severity: LabResult["severity"]) => {
    if (severity === "critical") return 3;
    if (severity === "warning") return 2;
    return 1;
  };
  
  const getLabSeverity = (names: string[]) => {
    const matches = labResults.filter((lab) =>
      names.some((name) => lab.name.toLowerCase().includes(name.toLowerCase()))
    );
    if (!matches.length) return "normal" as const;
    return matches.reduce((worst, lab) =>
      getSeverityRank(lab.severity) > getSeverityRank(worst)
        ? lab.severity
        : worst
    , "normal" as LabResult["severity"]);
  };
  
  const bodyPartStatus = {
    brain: getLabSeverity(["tsh"]),
    heart: getLabSeverity(["cholesterol", "ldl", "hdl", "triglycerides"]),
    liver: getLabSeverity(["alt"]),
    kidney: getLabSeverity(["creatinine"]),
    blood: getLabSeverity(["hemoglobin", "glucose"]),
  } as const;
  
  const statusClasses = (severity: LabResult["severity"]) =>
    severity === "critical"
      ? "bg-red-500/40 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.7)]"
      : severity === "warning"
      ? "bg-amber-500/30 text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.6)]"
      : "bg-emerald-500/25 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.5)]";
  
  const wireframeStroke =
    bodyPartStatus.heart === "critical" || bodyPartStatus.blood === "critical"
      ? "text-red-300"
      : bodyPartStatus.heart === "warning" || bodyPartStatus.blood === "warning"
      ? "text-amber-200"
      : "text-cyan-300";

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = `
COMPREHENSIVE MEDICAL REPORT ANALYSIS
${analysisData?.reportName || "Report"}
Generated: ${analysisData?.uploadDate || new Date().toLocaleDateString()}

${analysisData || "No analysis data available"}
    `;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", `report-analysis-${Date.now()}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const vitalSigns = [
    { label: "Blood Pressure", value: "120/80", normal: "mmHg", icon: "🫀" },
    { label: "Heart Rate", value: "72", normal: "bpm", icon: "💓" },
    { label: "Temperature", value: "98.6", normal: "°F", icon: "🌡️" },
    { label: "Breathing Rate", value: "16", normal: "/min", icon: "💨" },
    { label: "BMI", value: "23.5", normal: "kg/m²", icon: "⚖️" },
    { label: "O₂ Saturation", value: "98", normal: "%", icon: "🫁" },
  ];

  const healthMetrics = [
    { name: "Overall Health", score: 92, emoji: "💪" },
    { name: "Energy Level", score: 88, emoji: "⚡" },
    { name: "Mental Health", score: 85, emoji: "🧠" },
    { name: "Sleep Quality", score: 80, emoji: "😴" },
    { name: "Immunity", score: 90, emoji: "🛡️" },
    { name: "Fitness", score: 82, emoji: "🏃" },
  ];

  const recommendations = {
    "🥗 Nutrition & Diet": [
      "Increase fiber intake to 30g daily",
      "Stay hydrated with 8-10 glasses of water",
      "Include more leafy greens and colorful vegetables",
      "Limit processed foods and added sugars",
      "Eat healthy proteins at every meal",
      "Include omega-3 rich foods 2-3 times weekly",
      "Practice portion control and mindful eating",
    ],
    "🏃 Physical Activity": [
      "Aim for 150 minutes of moderate exercise weekly",
      "Include strength training 2-3 times per week",
      "Take short walking breaks every hour",
      "Try yoga or stretching for flexibility",
      "Stay active throughout the day",
      "Monitor your activity with wearables",
    ],
    "😴 Sleep & Rest": [
      "Maintain consistent sleep schedule (7-9 hours)",
      "Create a relaxing bedtime routine",
      "Avoid screens 1 hour before sleep",
      "Keep bedroom cool and dark",
      "Practice relaxation techniques",
    ],
    "🧘 Stress Management": [
      "Practice daily meditation (10-15 minutes)",
      "Try deep breathing exercises",
      "Engage in hobbies you enjoy",
      "Maintain work-life balance",
      "Connect with friends and family",
      "Consider professional counseling if needed",
    ],
    "💊 Health Monitoring": [
      "Regular check-ups every 6 months",
      "Monitor vital signs weekly",
      "Keep health records organized",
      "Track symptoms and patterns",
      "Follow-up on test recommendations",
    ],
  };

  const riskFactors = [
    { factor: "Sedentary Lifestyle", severity: "low", icon: "🪑" },
    { factor: "Sleep Deprivation", severity: "low", icon: "😫" },
    { factor: "Dietary Imbalance", severity: "medium", icon: "🍔" },
    { factor: "Stress Levels", severity: "low", icon: "😰" },
  ];

  const followUpSchedule = [
    {
      timeline: "🔴 Immediate (Next 2 weeks)",
      actions: [
        "Start new dietary modifications",
        "Begin daily exercise routine",
        "Schedule follow-up consultation",
      ],
    },
    {
      timeline: "🟡 Short-term (1-3 months)",
      actions: [
        "Re-assess vital signs",
        "Evaluate dietary adherence",
        "Adjust activity levels if needed",
        "Review lab results",
      ],
    },
    {
      timeline: "🟢 Long-term (6-12 months)",
      actions: [
        "Comprehensive health check-up",
        "Preventive screening tests",
        "Update health goals",
        "Long-term wellness planning",
      ],
    },
  ];

  const warningSigns = [
    "🚨 Persistent chest pain or pressure",
    "🚨 Sudden shortness of breath",
    "🚨 Severe headaches or dizziness",
    "🚨 Unexplained weight loss/gain",
    "🚨 Persistent high fever (>101°F)",
    "🚨 Vision changes or eye pain",
    "🚨 Difficulty speaking or facial drooping",
  ];

  const actionItems = [
    { timeframe: "📅 This Week", items: ["Schedule annual physical", "Order supplements"] },
    {
      timeframe: "📅 This Month",
      items: ["Start exercise routine", "Update dietary habits", "Reduce screen time"],
    },
    {
      timeframe: "📅 This Quarter",
      items: ["Complete recommended tests", "Re-evaluate health metrics", "Adjust medications if needed"],
    },
  ];

  const SectionCard = ({
    title,
    icon,
    isExpanded,
    children,
    onClick,
  }: {
    title: string;
    icon: string;
    isExpanded: boolean;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 border border-emerald-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-200/40 transition-all"
    >
      <button
        onClick={onClick}
        className="w-full p-6 flex items-center justify-between hover:bg-emerald-50/70 transition-all"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-xl font-bold text-emerald-700">
            {title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-2xl text-emerald-500">▼</span>
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6 border-t border-emerald-100 text-slate-700"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const ProgressBar = ({ label, value }: { label: string; value: number }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-600">{label}</span>
        <span className="text-sm font-bold text-emerald-600">{value}%</span>
      </div>
      <div className="w-full bg-emerald-100 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-lg shadow-emerald-300/60"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Background Tech Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tech-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" stroke="currentColor" strokeWidth="1" className="text-cyan-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-grid)" />
        </svg>
      </div>

      {/* Animated Background Particles */}
      <motion.div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [Math.random() * 100, -100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-slate-950/95 via-blue-950/90 to-slate-950/80 border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
        {/* Top-left corner bracket */}
        <div className="absolute top-2 left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-400/50" />
        
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-cyan-500/10 border border-cyan-500/30 rounded-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-cyan-400" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                ⚠️ MEDICAL HOLOGRAM ANALYZER
              </h1>
              <p className="text-sm text-blue-300">AI-POWERED BIOMETRIC DIAGNOSTIC SUITE</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px rgba(34, 211, 238, 0.5)",
                  "0 0 20px rgba(34, 211, 238, 0.8)",
                  "0 0 10px rgba(34, 211, 238, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                />
                <span className="text-xs font-mono text-green-300">ACTIVE • 99.8%</span>
              </div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 border border-cyan-500/30 transition-all"
            >
              <Printer className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 border border-blue-500/30 transition-all"
            >
              <Download className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 border border-purple-500/30 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Top-right corner bracket */}
        <div className="absolute top-2 right-4 w-6 h-6 border-r-2 border-t-2 border-cyan-400/50" />
      </div>

      {/* Demo Banner */}
      {true && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sticky top-[73px] z-40 bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-red-600/30 backdrop-blur-sm text-amber-200 px-4 py-3 shadow-lg border-y border-amber-500/30"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <AlertCircle className="w-5 h-5" />
            </motion.div>
            <span className="font-semibold">DEMO MODE:</span>
            <span>Scan a real prescription to activate live patient data analysis.</span>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Patient Information HUD Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/5 backdrop-blur-xl border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/10"
        >
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400" />

          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-cyan-300 tracking-wide">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
              />
              PATIENT BIOMETRIC PROFILE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "ID", value: patientInfo.name, icon: "👤" },
                { label: "AGE", value: `${patientInfo.age}Y`, icon: "📅" },
                { label: "SEX", value: patientInfo.gender, icon: "⚧" },
                { label: "BT", value: patientInfo.bloodType, icon: "🩸" },
                { label: "PHONE", value: patientInfo.phone.slice(-6), icon: "📞" },
                { label: "STATUS", value: "ACTIVE", icon: "✓" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(34, 211, 238, 0.15)" }}
                  className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-sm p-3 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer group"
                >
                  <p className="text-[10px] text-cyan-300/70 mb-1 font-mono tracking-widest uppercase">{item.label}</p>
                  <p className="text-sm font-bold text-cyan-200">{item.value}</p>
                  <p className="text-xs text-cyan-400/60 group-hover:text-cyan-300/80 transition-all">{item.icon}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Hologram Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-950 rounded-3xl p-8 border border-blue-700/40 shadow-2xl shadow-blue-500/30"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(59,130,246,0.25),transparent_55%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(59,130,246,0.08)_45%,transparent_100%)]" />
            <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,rgba(59,130,246,0.15)_0,rgba(59,130,246,0.15)_1px,transparent_1px,transparent_24px)]" />
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="absolute left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-blue-400/40 blur-[1px]"
                style={{ top: `${10 + idx * 14}%` }}
              />
            ))}
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={`ring-${idx}`}
                className="absolute left-1/2 -translate-x-1/2 w-[70%] h-[40px] border border-blue-400/30 rounded-full blur-[0.5px]"
                style={{ top: `${8 + idx * 18}%` }}
              />
            ))}
          </div>

          <h2 className="text-2xl font-bold text-blue-200 mb-6 text-center">
            🔷 Hologram Health Scan
          </h2>

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Side Lab Results */}
            <div className="space-y-4">
              {[
                { label: "THYROID", icon: "🧬", status: "normal", desc: "Within normal limit" },
                { label: "LIVER FUNCTION", icon: "🫘", status: "warning", desc: "Need attention" },
                { label: "KIDNEY FUNCTION", icon: "🫘", status: "normal", desc: "Within normal limit" },
                { label: "URINE R/E", icon: "🧪", status: "neutral", desc: "Test not part of package" },
                { label: "VITAMIN B12", icon: "💊", status: "normal", desc: "Within normal limit" },
                { label: "VITAMIN D", icon: "☀️", status: "warning", desc: "Need attention" },
                { label: "AMYLASE SERUM", icon: "🧬", status: "neutral", desc: "Test not part of package" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition-all"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === "normal"
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : item.status === "warning"
                        ? "bg-red-500 shadow-lg shadow-red-500/50"
                        : "bg-gray-500"
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Center - Wireframe Human */}
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                {/* Glowing Aura */}
                <div className="absolute inset-0 blur-3xl bg-gradient-to-t from-blue-500/40 via-cyan-400/20 to-transparent rounded-full" />

                {/* Body SVG/Icon */}
                <div className="relative z-10">
                  <svg
                    viewBox="0 0 100 200"
                    className={`w-36 h-52 ${wireframeStroke}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    {/* Head */}
                    <circle cx="50" cy="25" r="15" opacity="0.8" />
                    {/* Body */}
                    <line x1="50" y1="40" x2="50" y2="90" opacity="0.7" />
                    {/* Left Arm */}
                    <line x1="50" y1="50" x2="25" y2="65" opacity="0.7" />
                    {/* Right Arm */}
                    <line x1="50" y1="50" x2="75" y2="65" opacity="0.7" />
                    {/* Left Leg */}
                    <line x1="50" y1="90" x2="35" y2="150" opacity="0.7" />
                    {/* Right Leg */}
                    <line x1="50" y1="90" x2="65" y2="150" opacity="0.7" />
                    {/* Torso outline */}
                    <path d="M42 45 L58 45 L62 90 L38 90 Z" opacity="0.35" />
                  </svg>

                  {/* Status Indicators on Body */}
                  {[
                    { x: "50%", y: "15%", emoji: "🧠", label: "Brain", status: bodyPartStatus.brain },
                    { x: "50%", y: "45%", emoji: "❤️", label: "Heart", status: bodyPartStatus.heart },
                    { x: "50%", y: "55%", emoji: "🫘", label: "Liver", status: bodyPartStatus.liver },
                    { x: "50%", y: "65%", emoji: "🫘", label: "Kidney", status: bodyPartStatus.kidney },
                    { x: "50%", y: "30%", emoji: "🩸", label: "Blood", status: bodyPartStatus.blood },
                  ].map((point, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: idx * 0.3,
                      }}
                      className={`absolute w-7 h-7 text-lg flex items-center justify-center rounded-full ${statusClasses(
                        point.status
                      )}`}
                      style={{
                        left: point.x,
                        top: point.y,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span className="relative">{point.emoji}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <p className="text-slate-300 text-sm font-semibold mt-8 text-center">
                Overall Health Status
              </p>
              <div className="mt-4 flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="w-2 h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full shadow-lg shadow-green-400/50"
                  />
                ))}
              </div>
            </div>

            {/* Right Side Lab Results */}
            <div className="space-y-4">
              {[
                { label: "GLUCOSE", icon: "🩸", status: "normal", desc: "Within normal limit" },
                { label: "HBAIC", icon: "🩸", status: "warning", desc: "Need attention" },
                { label: "LIPID PROFILE", icon: "🧪", status: "warning", desc: "Need attention" },
                { label: "HS CRP", icon: "🧬", status: "neutral", desc: "Test not part of package" },
                { label: "APO A&B", icon: "🧬", status: "neutral", desc: "Test not part of package" },
                { label: "HEMOGRAM - CBC", icon: "🩸", status: "warning", desc: "Need attention" },
                { label: "IRON STUDIES", icon: "🧬", status: "neutral", desc: "Test not part of package" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition-all"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === "normal"
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : item.status === "warning"
                        ? "bg-red-500 shadow-lg shadow-red-500/50"
                        : "bg-gray-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <span className="text-2xl">{item.icon}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 flex justify-center gap-8 flex-wrap p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
              <span className="text-sm text-slate-300">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              <span className="text-sm text-slate-300">Need Attention</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-sm text-slate-300">Not Included</span>
            </div>
          </div>
        </motion.div>

        {/* Critical Alert */}
        {getAIRecommendations().critical && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-600 via-red-700 to-orange-600 rounded-2xl p-8 text-white shadow-2xl shadow-red-500/40 border-2 border-red-400"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">🚨</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Critical Alert</h3>
                <p className="text-lg mb-4">{getAIRecommendations().critical}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Contact Doctor Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comprehensive Lab Results with Reference Ranges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-emerald-100 shadow-2xl shadow-emerald-200/40"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            📊 Detailed Lab Results with Reference Ranges
          </h2>

          <div className="space-y-4">
            {labResults.map((lab, idx) => {
              const isOutOfRange =
                lab.value < lab.minNormal || lab.value > lab.maxNormal;
              const deviation = isOutOfRange
                ? ((lab.value - (lab.value < lab.minNormal ? lab.minNormal : lab.maxNormal)) /
                    (lab.value < lab.minNormal ? lab.minNormal : lab.maxNormal)) *
                  100
                : 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    lab.severity === "critical"
                      ? "bg-red-50 border-red-200 hover:border-red-300"
                      : lab.severity === "warning"
                      ? "bg-amber-50 border-amber-200 hover:border-amber-300"
                      : "bg-emerald-50 border-emerald-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Lab Name & Description */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{lab.icon}</span>
                        <h4 className="text-lg font-bold text-slate-900">
                          {lab.name}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600">{lab.description}</p>
                    </div>

                    {/* Actual Value */}
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        📊 Your Value
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          lab.severity === "critical"
                            ? "text-red-400"
                            : lab.severity === "warning"
                            ? "text-amber-300"
                            : "text-emerald-300"
                        }`}
                      >
                        {lab.value}
                      </p>
                      <p className="text-xs text-slate-500">{lab.unit}</p>
                    </div>

                    {/* Reference Range */}
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        📏 Normal Range
                      </p>
                      <p className="text-lg font-semibold text-emerald-600">
                        {lab.minNormal} - {lab.maxNormal}
                      </p>
                      <p className="text-xs text-slate-500">{lab.unit}</p>
                    </div>

                    {/* Status & Deviation */}
                    <div>
                      <p className="text-xs text-slate-500 mb-2">
                        ✓ Status
                      </p>
                      <div className="mb-3">
                        {lab.severity === "normal" && (
                          <div className="flex items-center gap-1 text-emerald-300 font-bold text-sm">
                            <CheckCircle className="w-4 h-4" /> NORMAL
                          </div>
                        )}
                        {lab.severity === "warning" && (
                          <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
                            <AlertCircle className="w-4 h-4" /> WARNING
                          </div>
                        )}
                        {lab.severity === "critical" && (
                          <div className="flex items-center gap-1 text-red-400 font-bold text-sm">
                            <AlertCircle className="w-4 h-4" /> CRITICAL
                          </div>
                        )}
                      </div>
                      {isOutOfRange && (
                        <p className="text-xs text-slate-500">
                          Deviation: {Math.abs(deviation).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-emerald-100">
                    <p className="text-xs text-slate-500 mb-2">
                      Range Position
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden relative">
                        {/* Min and Max markers */}
                        <div className="absolute inset-0 flex">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-200 to-emerald-400/40"
                            style={{
                              width: `${
                                ((lab.minNormal + lab.maxNormal) / 2 - lab.minNormal) /
                                (lab.maxNormal - lab.minNormal) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        {/* Value marker */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              Math.max(
                                ((lab.value - lab.minNormal) /
                                  (lab.maxNormal - lab.minNormal)) *
                                  100,
                                0
                              ),
                              100
                            )}%`,
                          }}
                          transition={{ duration: 1 }}
                          className={`h-full ${
                            lab.severity === "critical"
                              ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/50"
                              : lab.severity === "warning"
                              ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40"
                              : "bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/40"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {lab.minNormal} | {lab.maxNormal}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Recommendations Based on Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-emerald-100 shadow-2xl shadow-emerald-200/40"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            🤖 AI Recommendations Based on Your Results
          </h2>

          {/* Urgency Level */}
          <div className="mb-8 p-6 bg-emerald-50/80 rounded-xl border border-emerald-100">
            <p className="text-emerald-700 text-lg font-semibold mb-2">
              ⏰ Follow-up Urgency:
            </p>
            <p className="text-slate-700 text-base leading-relaxed">
              {getAIRecommendations().urgency}
            </p>
          </div>

          {/* Lifestyle Improvements */}
          <div>
            <h3 className="text-xl font-bold text-emerald-700 mb-4">
              💡 Recommended Lifestyle Changes:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getAIRecommendations().improvements.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-4 bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 transition-all"
                >
                  <p className="text-slate-700 font-medium">{rec}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>


        {/* Document Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-50/80 via-emerald-50/60 to-cyan-50/80 rounded-2xl p-8 text-slate-900 shadow-2xl shadow-emerald-200/40 border border-emerald-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-slate-500 text-sm mb-1">📄 Report Name</p>
              <p className="text-2xl font-bold text-emerald-700">{analysisData?.reportName || "Medical Report"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">📅 Analysis Date</p>
              <p className="text-2xl font-bold text-emerald-700">{analysisData?.uploadDate || "Jan 29, 2025"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">✓ Confidence Score</p>
              <p className="text-2xl font-bold text-emerald-700">{analysisData?.confidence || "98%"}</p>
            </div>
          </div>
        </motion.div>

        {/* Health Status Overview */}
        <SectionCard
          title="Overall Health Status"
          icon="🏥"
          isExpanded={expandedSections.includes("health-status")}
          onClick={() => toggleSection("health-status")}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 p-6 rounded-xl border border-emerald-500/30">
                <p className="text-sm text-slate-300 mb-2">✓ General Condition</p>
                <p className="text-2xl font-bold text-emerald-400">Excellent</p>
              </div>
              <div className="bg-slate-700/50 p-6 rounded-xl border border-cyan-500/30">
                <p className="text-sm text-slate-300 mb-2">📊 Health Index</p>
                <p className="text-2xl font-bold text-cyan-400">92/100</p>
              </div>
            </div>
            <ProgressBar label="Overall Wellness Score" value={92} />
            <div className="bg-slate-700/30 p-4 rounded-lg border border-amber-500/30">
              <p className="text-sm text-amber-300">
                ⚡ <strong>Status:</strong> Your health indicators show excellent overall wellness. Continue
                your current lifestyle with the recommended improvements.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Vital Signs */}
        <SectionCard
          title="Vital Signs & Measurements"
          icon="🔬"
          isExpanded={expandedSections.includes("vital-signs")}
          onClick={() => toggleSection("vital-signs")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vitalSigns.map((vital, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{vital.icon}</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
                    ✓ Normal
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-1">{vital.label}</p>
                <p className="text-2xl font-bold text-cyan-300">{vital.value}</p>
                <p className="text-xs text-slate-500">{vital.normal}</p>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Summary Overview - Already shown in detailed section above */}

        {/* Health Metrics Dashboard */}
        <SectionCard
          title="Health Metrics Dashboard"
          icon="📈"
          isExpanded={expandedSections.includes("health-metrics")}
          onClick={() => toggleSection("health-metrics")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthMetrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative overflow-hidden rounded-xl bg-slate-700/50 p-6 border border-slate-600 hover:border-cyan-400 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{metric.emoji}</span>
                  <span className="text-3xl font-bold text-cyan-300">
                    {metric.score}%
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-300 mb-3">{metric.name}</p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full shadow-lg shadow-cyan-400/40"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Risk Factors */}
        <SectionCard
          title="Risk Factors & Monitoring Areas"
          icon="⚠️"
          isExpanded={expandedSections.includes("risk-factors")}
          onClick={() => toggleSection("risk-factors")}
        >
          <div className="space-y-3">
            {riskFactors.map((risk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                  risk.severity === "low"
                    ? "bg-slate-700/30 border-emerald-500/50"
                    : "bg-slate-700/30 border-amber-500/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{risk.icon}</span>
                  <span className="font-semibold text-slate-200">{risk.factor}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    risk.severity === "low"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {risk.severity.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Personalized Recommendations */}
        <SectionCard
          title="Personalized Health Recommendations"
          icon="🎯"
          isExpanded={expandedSections.includes("recommendations")}
          onClick={() => toggleSection("recommendations")}
        >
          <div className="space-y-6">
            {Object.entries(recommendations).map(([category, items], idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">{category}</h4>
                <div className="space-y-2">
                  {items.map((item, itemIdx) => (
                    <motion.div
                      key={itemIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx * items.length + itemIdx) * 0.05 }}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg"
                    >
                      <span className="text-lg mt-0.5">✓</span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Follow-up Schedule */}
        <SectionCard
          title="Follow-up Schedule & Preventive Care"
          icon="🔄"
          isExpanded={expandedSections.includes("follow-up")}
          onClick={() => toggleSection("follow-up")}
        >
          <div className="space-y-6">
            {followUpSchedule.map((schedule, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-indigo-200"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">{schedule.timeline}</h4>
                <ul className="space-y-2">
                  {schedule.actions.map((action, actionIdx) => (
                    <li
                      key={actionIdx}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="text-blue-600">▶</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Emergency Warning Signs */}
        <SectionCard
          title="Emergency Warning Signs"
          icon="🚨"
          isExpanded={expandedSections.includes("warning-signs")}
          onClick={() => toggleSection("warning-signs")}
        >
          <div className="bg-red-50 p-6 rounded-xl border-2 border-red-300">
            <p className="text-sm text-red-900 mb-4 font-semibold">
              ⚠️ Seek immediate medical attention if you experience any of the following:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {warningSigns.map((sign, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-3 rounded-lg border border-red-200"
                >
                  <p className="text-sm font-semibold text-gray-900">{sign}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Action Items */}
        <SectionCard
          title="Action Items Checklist"
          icon="✅"
          isExpanded={expandedSections.includes("action-items")}
          onClick={() => toggleSection("action-items")}
        >
          <div className="space-y-6">
            {actionItems.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">{section.timeframe}</h4>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <motion.label
                      key={itemIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx * 3 + itemIdx) * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg cursor-pointer hover:shadow-md transition-all"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-green-600 rounded cursor-pointer"
                      />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 p-6 rounded-xl border border-gray-300"
        >
          <p className="text-xs text-gray-700 leading-relaxed">
            ⚕️ <strong>Medical Disclaimer:</strong> This AI-generated analysis is for educational and informational
            purposes only and should not be considered as professional medical advice. Always consult with qualified
            healthcare professionals for medical concerns, diagnosis, or treatment. This report does not replace a
            professional medical examination or diagnosis. Follow up with your physician for personalized medical advice.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <p className="text-sm text-gray-600">
            © 2025 MediTatva - Healthcare at Your Fingertips 💙
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisDetailPage;
