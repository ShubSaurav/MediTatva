import { useState, type ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Download, FileText, Brain, Sparkles,
  Activity, Heart, Droplet, Lightbulb, Flame,
  AlertTriangle, Info, ChevronRight, Stethoscope, Calendar, BarChart3, CheckCircle, Target,
  TrendingUp, Clock, Shield, Zap, MessageSquare
} from "lucide-react";

const AnalysisDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const report = location.state?.report;

  // Mock extracted health data
  const extractedData = {
    patientInfo: {
      name: report?.fileName?.replace(/\.(pdf|jpg|png|jpeg)$/i, '') || "Patient Report",
      age: "32 years",
      gender: "Male",
      bloodGroup: "O+",
      reportType: "Comprehensive Health Panel"
    },
    vitalSigns: report?.vitalSigns ?? {},
    keyMetrics: [
      { name: "Hemoglobin", value: 13.5, normal: [13, 17], unit: "g/dL", status: "normal" },
      { name: "Glucose", value: 95, normal: [70, 100], unit: "mg/dL", status: "normal" },
      { name: "Cholesterol", value: 180, normal: [0, 200], unit: "mg/dL", status: "normal" },
      { name: "Creatinine", value: 0.9, normal: [0.7, 1.3], unit: "mg/dL", status: "normal" }
    ],
    reportComparisons: [
      {
        name: "Thyroid (TSH)",
        result: 2.1,
        unit: "mIU/L",
        range: "0.4 - 4.0",
        status: "normal",
        cause: "Balanced thyroid hormone production.",
        context: "Consistent energy levels and stable weight patterns align with this result.",
        tips: "Maintain iodine intake and regular sleep."
      },
      {
        name: "Liver Function (ALT)",
        result: 48,
        unit: "U/L",
        range: "7 - 40",
        status: "attention",
        cause: "Possible fatty liver or recent medication impact.",
        context: "Recent dietary changes or certain antibiotics can transiently raise ALT.",
        tips: "Reduce alcohol, limit fried foods, hydrate well."
      },
      {
        name: "Kidney Function (Creatinine)",
        result: 0.9,
        unit: "mg/dL",
        range: "0.7 - 1.3",
        status: "normal",
        cause: "Healthy filtration and hydration status.",
        context: "Stable hydration and normal muscle mass support this value.",
        tips: "Continue balanced hydration and low-sodium diet."
      },
      {
        name: "HbA1c",
        result: 5.8,
        unit: "%",
        range: "4.0 - 5.6",
        status: "attention",
        cause: "Borderline glucose control in recent months.",
        context: "Recent high-carb meals or irregular activity can elevate HbA1c.",
        tips: "Limit refined carbs, increase walking after meals."
      },
      {
        name: "Lipid Profile (LDL)",
        result: 132,
        unit: "mg/dL",
        range: "0 - 100",
        status: "attention",
        cause: "High saturated fat intake or low activity.",
        context: "Family history and reduced cardio can influence LDL trends.",
        tips: "Increase fiber, add omega-3 sources, cardio 3x/week."
      },
      {
        name: "Vitamin D",
        result: 18,
        unit: "ng/mL",
        range: "30 - 100",
        status: "attention",
        cause: "Low sunlight exposure or poor absorption.",
        context: "Indoor routines or sunscreen use may reduce synthesis.",
        tips: "Morning sunlight and physician-guided supplementation."
      }
    ],
    comparisonData: [
      { month: "Jan", current: 95, previous: 92, optimal: 90 },
      { month: "Feb", current: 93, previous: 95, optimal: 90 },
      { month: "Mar", current: 95, previous: 94, optimal: 90 },
      { month: "Apr", current: 94, previous: 96, optimal: 90 },
      { month: "May", current: 95, previous: 93, optimal: 90 }
    ],
    healthScore: {
      overall: 91,
      cardiovascular: 88,
      metabolic: 92,
      respiratory: 95,
      immunity: 87
    },
    aiSummary: "Your report indicates strong overall wellness with a few metabolic markers requiring attention. Prioritizing diet quality, sunlight exposure, and consistent activity should normalize the highlighted values.",
    aiInsights: [
      {
        type: "success",
        icon: CheckCircle,
        title: "Excellent Overall Health",
        description: "All major health indicators are within optimal ranges.",
        confidence: 95
      },
      {
        type: "info",
        icon: Info,
        title: "Stable Glucose Levels",
        description: "Blood glucose levels remain consistently healthy.",
        confidence: 92
      },
      {
        type: "warning",
        icon: AlertTriangle,
        title: "Monitor Cholesterol",
        description: "Cholesterol approaching upper limit. Reduce saturated fats.",
        confidence: 88
      }
    ],
    recommendations: [
      { icon: Activity, text: "Continue regular exercise (30 min daily)", priority: "high" },
      { icon: Heart, text: "Maintain heart-healthy diet", priority: "high" },
      { icon: Droplet, text: "Stay hydrated (8 glasses water/day)", priority: "medium" },
      { icon: Target, text: "Schedule follow-up in 6 months", priority: "medium" }
    ]
  };

  const hasVitalSigns = Object.keys(extractedData.vitalSigns).length > 0;

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState(
    extractedData.reportComparisons[0]?.name ?? ""
  );
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const activeComparison = extractedData.reportComparisons.find(
    (item) => item.name === activeItem
  );

  const overviewLeft = extractedData.reportComparisons.slice(0, Math.ceil(extractedData.reportComparisons.length / 2));
  const overviewRight = extractedData.reportComparisons.slice(Math.ceil(extractedData.reportComparisons.length / 2));
  const overviewExtrasLeft = [
    { name: "Urine R/E", status: "Not in package" },
    { name: "Vitamin B12", status: "Within normal limit" },
    { name: "Amylase Serum", status: "Not in package" }
  ];
  const overviewExtrasRight = [
    { name: "hs-CRP", status: "Not in package" },
    { name: "Apo A&B", status: "Not in package" },
    { name: "Iron Studies", status: "Not in package" }
  ];

  const handlePdfUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF report.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
  };

  const handleDownload = () => {
    const analysisReport = `MediTatva AI Health Analysis
Patient: ${extractedData.patientInfo.name}
Date: ${new Date().toLocaleDateString()}
Overall Health Score: ${extractedData.healthScore.overall}/100`;
    
    const blob = new Blob([analysisReport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report?.fileName || 'health-analysis'}-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-teal-600 bg-teal-100";
      case "excellent": return "text-emerald-600 bg-emerald-100";
      case "attention": return "text-amber-600 bg-amber-100";
      case "warning": return "text-amber-600 bg-amber-100";
      default: return "text-slate-600 bg-slate-100";
    }
  };

  const getStatusBadge = (status: string, result: number, range: string) => {
    const [min, max] = range.split(' - ').map(v => parseFloat(v));
    const percentage = ((result - min) / (max - min)) * 100;
    
    if (status === "normal" || (percentage > 30 && percentage < 70)) {
      return { label: "Excellent", color: "bg-emerald-500 text-white", glow: "from-emerald-400/60 to-emerald-500/40" };
    } else if (status === "attention" && percentage >= 70 && percentage < 100) {
      return { label: "Good", color: "bg-teal-500 text-white", glow: "from-teal-400/60 to-teal-500/40" };
    } else if (status === "attention" && percentage >= 100) {
      return { label: "Critical", color: "bg-red-500 text-white", glow: "from-red-400/60 to-red-500/40" };
    } else if (status === "attention") {
      return { label: "Avg", color: "bg-amber-500 text-white", glow: "from-amber-400/60 to-amber-500/40" };
    }
    return { label: "Very Good", color: "bg-cyan-500 text-white", glow: "from-cyan-400/60 to-cyan-500/40" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.15, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/40 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-500/40 to-teal-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [-10, 10, -10], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Premium Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-16"
        >
          <Button
            variant="ghost"
            className="text-cyan-400/80 hover:text-cyan-300 hover:bg-white/5 rounded-full w-10 h-10 p-0 transition-all"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl rounded-full px-6 font-semibold transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </motion.div>
        </motion.div>

        {/* Premium Patient Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-3xl">
            {/* Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative p-6 md:p-8 border border-white/10 rounded-3xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-300 mb-4">
                      {extractedData.patientInfo.name}
                    </h1>
                  </motion.div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-cyan-200/90 mb-8">
                    {[
                      { icon: Stethoscope, label: extractedData.patientInfo.age },
                      { icon: null, label: extractedData.patientInfo.gender },
                      { icon: Droplet, label: extractedData.patientInfo.bloodGroup },
                      { icon: Calendar, label: new Date().toLocaleDateString() }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + idx * 0.05 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        {item.icon && <item.icon className="h-4 w-4 text-cyan-400" />}
                        <span className="text-sm font-medium">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-wrap gap-3"
                  >
                    <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 rounded-full px-4 py-1 text-xs font-semibold">
                      ✓ {extractedData.patientInfo.reportType}
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-200 border border-green-400/40 rounded-full px-4 py-1 text-xs font-semibold">
                      Health Score: {extractedData.healthScore.overall}/100
                    </Badge>
                  </motion.div>
                </div>
                
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex-shrink-0 ml-8"
                >
                  <div className="flex items-center justify-center">
                    <img src="/gallery/MEDITATVA%20LOGO%20FINAL%20without%20name.png" alt="Meditatva" className="h-36 w-36 drop-shadow-xl" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vital Signs - Enhanced Grid */}
        {hasVitalSigns && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-green-500/20 border border-green-400/40">
                <Activity className="h-6 w-6 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Vital Signs</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {Object.entries(extractedData.vitalSigns as Record<string, { value: string; status: string; change: number }>).map(([key, vital], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="group relative overflow-hidden rounded-2xl h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/40 via-emerald-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                    
                    <div className="relative p-6 border border-white/10 group-hover:border-white/20 rounded-2xl transition-all h-full flex flex-col">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-green-400/40">
                          {key === 'bloodPressure' && <Activity className="h-6 w-6 text-cyan-400" />}
                          {key === 'heartRate' && <Heart className="h-6 w-6 text-rose-400" />}
                          {key === 'temperature' && <Flame className="h-6 w-6 text-orange-400" />}
                          {key === 'oxygenLevel' && <Droplet className="h-6 w-6 text-blue-400" />}
                        </div>
                        <Badge className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 rounded-full text-xs font-bold">
                          {vital.status === "normal" ? "Normal" : "Excellent"}
                        </Badge>
                      </div>
                      
                      <p className="text-green-200/60 text-xs font-medium uppercase tracking-wider mb-2">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-4xl font-bold text-white mb-auto">{vital.value}</p>
                      
                      <div className="flex items-center gap-1 text-emerald-300/80 text-xs mt-4">
                        <TrendingUp className="h-3 w-3" />
                        <span>{vital.change > 0 ? '+' : ''}{vital.change}% from last month</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Holographic Body Map - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/40">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Body System Analysis</h2>
          </div>
          
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-slate-950/40 backdrop-blur-lg" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(34,211,238,0.15),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.10),transparent_50%)]" />
            
            <div className="relative p-10 border border-white/10 rounded-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-12 items-center">
                {/* Enhanced Hologram */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="relative w-80 h-[440px]">
                    {/* Hologram base glow */}
                    <motion.div
                      animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.98, 1.03, 0.98] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="absolute inset-0 rounded-3xl border-2 border-green-400/60 shadow-[0_0_80px_rgba(34,197,94,0.45),inset_0_0_80px_rgba(34,197,94,0.15)] bg-[radial-gradient(circle_at_50%_40%,rgba(34,197,94,0.28),transparent_65%)]"
                    />

                    {/* Hologram grid overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-40 bg-[linear-gradient(transparent_0%,rgba(34,197,94,0.08)_10%,transparent_20%),linear-gradient(90deg,transparent_0%,rgba(34,197,94,0.08)_10%,transparent_20%)] bg-[length:28px_28px]" />

                    {/* Orbit rings */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-6 rounded-full border border-green-400/30"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-12 rounded-full border border-green-500/20"
                    />

                    {/* Scanning line */}
                    <motion.div
                      animate={{ y: [0, 360, 0], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-8 right-8 h-10 bg-gradient-to-b from-green-400/0 via-green-300/25 to-green-400/0 blur-sm"
                    />

                    {/* Floating particles */}
                    {[
                      { top: "15%", left: "20%" },
                      { top: "30%", left: "75%" },
                      { top: "55%", left: "15%" },
                      { top: "70%", left: "80%" }
                    ].map((pos, i) => (
                      <motion.div
                        key={`particle-${i}`}
                        animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 3 + i, repeat: Infinity }}
                        className="absolute h-2 w-2 rounded-full bg-green-300/60 shadow-[0_0_12px_rgba(34,197,94,0.7)]"
                        style={{ top: pos.top, left: pos.left }}
                      />
                    ))}
                    
                    <div className="relative z-10 h-[420px] flex items-center justify-center">
                      <div className="relative w-56 h-[360px]">
                        {/* Holo frame */}
                        <motion.div
                          animate={{ opacity: [0.35, 0.7, 0.35] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute inset-0 rounded-3xl border border-green-400/40 shadow-[0_0_60px_rgba(34,197,94,0.45)]"
                        />

                        {/* Vertical light pillars */}
                        {Array.from({ length: 7 }).map((_, i) => (
                          <motion.div
                            key={`pillar-${i}`}
                            animate={{ opacity: [0.15, 0.35, 0.15] }}
                            transition={{ duration: 3 + i * 0.3, repeat: Infinity }}
                            className="absolute top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-green-300/40 to-transparent"
                            style={{ left: `${12 + i * 12}%` }}
                          />
                        ))}

                        {/* Orbit rings */}
                        {Array.from({ length: 4 }).map((_, i) => (
                          <motion.div
                            key={`ring-${i}`}
                            animate={{ rotate: i % 2 === 0 ? 360 : -360, opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-1/2 -translate-x-1/2 w-44 h-8 border border-green-400/40 rounded-full"
                            style={{ top: `${18 + i * 18}%` }}
                          />
                        ))}

                        {/* Holo avatar - Human Figure */}
                        <div className="relative z-10 h-full flex items-center justify-center">
                          <div className="relative w-40 h-80">
                            {/* Head */}
                            <motion.div
                              animate={{ opacity: [0.5, 0.85, 0.5] }}
                              transition={{ duration: 2.6, repeat: Infinity }}
                              className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-2 border-green-300/70 bg-green-400/15 shadow-[0_0_24px_rgba(34,197,94,0.7)]"
                            />
                            
                            {/* Neck */}
                            <motion.div
                              animate={{ opacity: [0.4, 0.65, 0.4] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="absolute top-[72px] left-1/2 -translate-x-1/2 w-6 h-6 border-2 border-green-300/50 bg-green-400/10 shadow-[0_0_16px_rgba(34,197,94,0.5)]"
                            />
                            
                            {/* Shoulders */}
                            <motion.div
                              animate={{ opacity: [0.4, 0.7, 0.4] }}
                              transition={{ duration: 3.2, repeat: Infinity }}
                              className="absolute top-[88px] left-1/2 -translate-x-1/2 w-32 h-3 rounded-full border-2 border-green-300/60 bg-green-400/15 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                            />
                            
                            {/* Left Arm */}
                            <motion.div
                              animate={{ opacity: [0.35, 0.6, 0.35], rotate: [0, -5, 0] }}
                              transition={{ duration: 3.5, repeat: Infinity }}
                              className="absolute top-[92px] left-[4px] w-3 h-24 rounded-lg border-2 border-green-300/50 bg-green-400/10 shadow-[0_0_18px_rgba(34,197,94,0.5)]"
                            />
                            
                            {/* Right Arm */}
                            <motion.div
                              animate={{ opacity: [0.35, 0.6, 0.35], rotate: [0, 5, 0] }}
                              transition={{ duration: 3.5, repeat: Infinity }}
                              className="absolute top-[92px] right-[4px] w-3 h-24 rounded-lg border-2 border-green-300/50 bg-green-400/10 shadow-[0_0_18px_rgba(34,197,94,0.5)]"
                            />
                            
                            {/* Upper Torso */}
                            <motion.div
                              animate={{ opacity: [0.4, 0.7, 0.4] }}
                              transition={{ duration: 3.4, repeat: Infinity }}
                              className="absolute top-[100px] left-1/2 -translate-x-1/2 w-24 h-32 rounded-[20px] border-2 border-emerald-300/60 bg-emerald-400/15 shadow-[0_0_28px_rgba(16,185,129,0.6)]"
                            />
                            
                            {/* Heart/Chest Glow */}
                            <motion.div
                              animate={{ opacity: [0.45, 0.9, 0.45], scale: [1, 1.15, 1] }}
                              transition={{ duration: 1.4, repeat: Infinity }}
                              className="absolute top-[120px] left-1/2 -translate-x-1/2 w-9 h-9 rounded-full border-2 border-green-300/70 bg-green-400/25 shadow-[0_0_32px_rgba(34,197,94,0.85)]"
                            />
                            
                            {/* Lower Torso/Waist */}
                            <motion.div
                              animate={{ opacity: [0.4, 0.65, 0.4] }}
                              transition={{ duration: 3.8, repeat: Infinity }}
                              className="absolute top-[232px] left-1/2 -translate-x-1/2 w-20 h-16 rounded-[18px] border-2 border-green-300/55 bg-green-400/12 shadow-[0_0_22px_rgba(34,197,94,0.55)]"
                            />
                            
                            {/* Left Leg */}
                            <motion.div
                              animate={{ opacity: [0.35, 0.6, 0.35] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute top-[248px] left-[38px] w-5 h-28 rounded-lg border-2 border-emerald-300/55 bg-emerald-400/12 shadow-[0_0_20px_rgba(16,185,129,0.55)]"
                            />
                            
                            {/* Right Leg */}
                            <motion.div
                              animate={{ opacity: [0.35, 0.6, 0.35] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute top-[248px] right-[38px] w-5 h-28 rounded-lg border-2 border-emerald-300/55 bg-emerald-400/12 shadow-[0_0_20px_rgba(16,185,129,0.55)]"
                            />
                          </div>
                        </div>

                        {/* Scanning line */}
                        <motion.div
                          animate={{ y: [10, 320, 10], opacity: [0.2, 0.6, 0.2] }}
                          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-6 right-6 h-10 bg-gradient-to-b from-green-400/0 via-green-300/25 to-green-400/0 blur"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* System Status Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    System Health
                  </h3>
                  
                  {extractedData.reportComparisons.map((item, idx) => {
                    const statusInfo = getStatusBadge(item.status, item.result, item.range);
                    const isActive = activeItem === item.name;
                    
                    return (
                      <motion.button
                        key={item.name}
                        type="button"
                        onClick={() => setActiveItem(item.name)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + idx * 0.04 }}
                        whileHover={{ x: 5 }}
                        className={`w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/30 to-emerald-500/20 border border-cyan-400/60'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${statusInfo.glow} opacity-0 group-hover:opacity-20 transition-opacity`} />
                        
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <motion.div
                              animate={{ scale: isActive ? 1.2 : 1, opacity: isActive ? 1 : 0.6 }}
                              className={`h-2.5 w-2.5 rounded-full ${
                                item.status === "normal" ? "bg-emerald-400" : "bg-amber-400"
                              }`}
                            />
                            <div className="text-left">
                              <p className="text-white font-semibold text-sm">{item.name}</p>
                              <p className="text-green-200/60 text-xs">{item.result} {item.unit}</p>
                            </div>
                          </div>
                          <Badge className={`${statusInfo.color} border-0 text-xs font-bold rounded-full`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              {/* AI Context Box */}
              <AnimatePresence>
                {activeComparison && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-emerald-500/10 border border-green-400/40 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-4">
                      <MessageSquare className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-cyan-300 font-bold text-lg mb-2">{activeComparison.name}</p>
                        <p className="text-cyan-100/90 text-sm leading-relaxed mb-3">{activeComparison.context}</p>
                        <div className="flex items-center justify-between text-xs text-cyan-200/70 bg-white/5 rounded-lg p-3 border border-white/10">
                          <span><strong>Normal Range:</strong> {activeComparison.range} {activeComparison.unit}</span>
                          <span><strong>Your Value:</strong> {activeComparison.result} {activeComparison.unit}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Report Overview Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-200 font-semibold tracking-wide">
              Report • Overview
            </div>
          </div>
          <p className="text-center text-green-200/60 text-sm mb-6">System-wide snapshot of key tests and package coverage</p>

          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-slate-900/60 to-slate-950/60 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.15),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(34,211,238,0.12),transparent_45%)]" />

            <div className="relative p-8 md:p-10 border border-white/10 rounded-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-8 items-center">
                {/* Left list */}
                <div className="space-y-4">
                  {overviewLeft.map((item) => (
                    <div key={`left-${item.name}`} className="group flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] ${item.status === "normal" ? "bg-emerald-400 shadow-emerald-400/40" : "bg-amber-400 shadow-amber-400/40"}`} />
                        <div>
                          <p className="text-white text-sm font-semibold">{item.name}</p>
                          <p className="text-green-200/60 text-xs">{item.status === "normal" ? "Within normal limit" : "Need attention"}</p>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-green-400/40 bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center text-green-200 text-xs font-bold transition-all">
                        {item.name.split(" ").map((w) => w[0]).join("")}
                      </div>
                    </div>
                  ))}

                  {overviewExtrasLeft.map((item) => (
                    <div key={`left-extra-${item.name}`} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${item.status === "Not in package" ? "bg-slate-400" : "bg-emerald-400"}`} />
                        <div>
                          <p className="text-white/80 text-sm font-semibold">{item.name}</p>
                          <p className="text-green-200/40 text-xs">{item.status}</p>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 text-xs font-bold">
                        {item.name.split(" ").map((w) => w[0]).join("")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Center hologram */}
                <div className="flex justify-center">
                  <div className="relative w-72 h-[420px]">
                    <motion.div
                      animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.98, 1.03, 0.98] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl border border-green-400/40 shadow-[0_0_80px_rgba(34,197,94,0.35)] bg-[radial-gradient(circle_at_50%_40%,rgba(34,197,94,0.22),transparent_60%)]"
                    />
                    <div className="absolute inset-0 rounded-2xl opacity-40 bg-[linear-gradient(transparent_0%,rgba(34,197,94,0.08)_10%,transparent_20%),linear-gradient(90deg,transparent_0%,rgba(34,197,94,0.08)_10%,transparent_20%)] bg-[length:26px_26px]" />
                    <motion.div
                      animate={{ y: [0, 380, 0], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-6 right-6 h-10 bg-gradient-to-b from-green-400/0 via-green-300/25 to-green-400/0 blur-sm"
                    />

                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className="relative w-52 h-[360px]">
                        <motion.div
                          animate={{ opacity: [0.35, 0.7, 0.35] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute inset-0 rounded-2xl border border-green-400/35 shadow-[0_0_50px_rgba(34,197,94,0.4)]"
                        />

                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={`ov-pillar-${i}`}
                            animate={{ opacity: [0.15, 0.35, 0.15] }}
                            transition={{ duration: 3 + i * 0.3, repeat: Infinity }}
                            className="absolute top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-green-300/35 to-transparent"
                            style={{ left: `${14 + i * 12}%` }}
                          />
                        ))}

                        {Array.from({ length: 3 }).map((_, i) => (
                          <motion.div
                            key={`ov-ring-${i}`}
                            animate={{ rotate: i % 2 === 0 ? 360 : -360, opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 9 + i * 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-1/2 -translate-x-1/2 w-36 h-7 border border-green-400/35 rounded-full"
                            style={{ top: `${22 + i * 22}%` }}
                          />
                        ))}

                        <div className="relative z-10 h-full flex items-center justify-center">
                          <div className="relative w-32 h-64">
                            {/* Head */}
                            <motion.div
                              animate={{ opacity: [0.5, 0.85, 0.5] }}
                              transition={{ duration: 2.6, repeat: Infinity }}
                              className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-green-300/70 bg-green-400/15 shadow-[0_0_20px_rgba(34,197,94,0.7)]"
                            />
                            
                            {/* Neck */}
                            <motion.div
                              animate={{ opacity: [0.4, 0.65, 0.4] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="absolute top-[56px] left-1/2 -translate-x-1/2 w-5 h-5 border-2 border-green-300/50 bg-green-400/10 shadow-[0_0_14px_rgba(34,197,94,0.5)]"
                            />
                            
                            {/* Shoulders */}
                            <motion.div
                              animate={{ opacity: [0.4, 0.7, 0.4] }}
                              transition={{ duration: 3.2, repeat: Infinity }}
                              className="absolute top-[68px] left-1/2 -translate-x-1/2 w-28 h-2.5 rounded-full border-2 border-green-300/60 bg-green-400/15 shadow-[0_0_18px_rgba(34,197,94,0.6)]"
                            />
                            
                            {/* Left Arm */}
                            <motion.div
                              animate={{ opacity: [0.35, 0.6, 0.35], rotate: [0, -5, 0] }}
                              transition={{ duration: 3.5, repeat: Infinity }}
                              className="absolute top-[70px] left-[2px] w-2.5 h-20 rounded-lg border-2 border-green-300/50 bg-green-400/10 shadow-[0_0_16px_rgba(34,197,94,0.5)]"
                            />
                            
                            {/* Right Arm */}
                            <motion.div
                              animate={{ opacity: [0.35, 0.6, 0.35], rotate: [0, 5, 0] }}
                              transition={{ duration: 3.5, repeat: Infinity }}
                              className="absolute top-[70px] right-[2px] w-2.5 h-20 rounded-lg border-2 border-green-300/50 bg-green-400/10 shadow-[0_0_16px_rgba(34,197,94,0.5)]"
                            />
                            
                            {/* Upper Torso */}
                            <motion.div
                              animate={{ opacity: [0.4, 0.7, 0.4] }}
                              transition={{ duration: 3.4, repeat: Infinity }}
                              className="absolute top-[76px] left-1/2 -translate-x-1/2 w-20 h-26 rounded-[18px] border-2 border-emerald-300/60 bg-emerald-400/15 shadow-[0_0_24px_rgba(16,185,129,0.6)]"
                            />
                            
                            {/* Heart/Chest Glow */}
                            <motion.div
                              animate={{ opacity: [0.45, 0.9, 0.45], scale: [1, 1.15, 1] }}
                              transition={{ duration: 1.4, repeat: Infinity }}
                              className="absolute top-[92px] left-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-green-300/70 bg-green-400/25 shadow-[0_0_28px_rgba(34,197,94,0.85)]"
                            />
                            
                            {/* Lower Torso/Waist */}
                            <motion.div
                              animate={{ opacity: [0.4, 0.65, 0.4] }}
                              transition={{ duration: 3.8, repeat: Infinity }}
                              className="absolute top-[180px] left-1/2 -translate-x-1/2 w-18 h-14 rounded-[16px] border-2 border-green-300/55 bg-green-400/12 shadow-[0_0_20px_rgba(34,197,94,0.55)]"
                            />
                            
                            {/* Left Leg */}
                            <motion.div
                              animate={{ opacity: [0.35, 0.6, 0.35] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute top-[194px] left-[32px] w-4 h-24 rounded-lg border-2 border-emerald-300/55 bg-emerald-400/12 shadow-[0_0_18px_rgba(16,185,129,0.55)]"
                            />
                            
                            {/* Right Leg */}
                            <motion.div
                              animate={{ opacity: [0.35, 0.6, 0.35] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute top-[194px] right-[32px] w-4 h-24 rounded-lg border-2 border-emerald-300/55 bg-emerald-400/12 shadow-[0_0_18px_rgba(16,185,129,0.55)]"
                            />
                          </div>
                        </div>

                        <motion.div
                          animate={{ y: [10, 300, 10], opacity: [0.2, 0.6, 0.2] }}
                          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-6 right-6 h-10 bg-gradient-to-b from-green-400/0 via-green-300/25 to-green-400/0 blur"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-cyan-200/70">Live Holo Scan</div>
                  </div>
                </div>

                {/* Right list */}
                <div className="space-y-4">
                  {overviewRight.map((item) => (
                    <div key={`right-${item.name}`} className="group flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] ${item.status === "normal" ? "bg-emerald-400 shadow-emerald-400/40" : "bg-amber-400 shadow-amber-400/40"}`} />
                        <div>
                          <p className="text-white text-sm font-semibold">{item.name}</p>
                          <p className="text-green-200/60 text-xs">{item.status === "normal" ? "Within normal limit" : "Need attention"}</p>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-green-400/40 bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center text-green-200 text-xs font-bold transition-all">
                        {item.name.split(" ").map((w) => w[0]).join("")}
                      </div>
                    </div>
                  ))}

                  {overviewExtrasRight.map((item) => (
                    <div key={`right-extra-${item.name}`} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${item.status === "Not in package" ? "bg-slate-400" : "bg-emerald-400"}`} />
                        <div>
                          <p className="text-white/80 text-sm font-semibold">{item.name}</p>
                          <p className="text-green-200/40 text-xs">{item.status}</p>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 text-xs font-bold">
                        {item.name.split(" ").map((w) => w[0]).join("")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-cyan-200/70">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Within normal limit</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" />Need attention</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-400" />Not in package</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test Analysis Grid - Premium Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/40">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Test Results Analysis</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {extractedData.reportComparisons.map((item, idx) => {
              const statusInfo = getStatusBadge(item.status, item.result, item.range);
              const isExpanded = expandedItem === item.name;
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + idx * 0.04 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl h-full">
                    {/* Animated Border */}
                    <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/40 via-emerald-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                    
                    <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-white/10 group-hover:border-white/20 rounded-2xl p-6 transition-all h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex-1 pr-4">{item.name}</h3>
                        <Badge className={`${statusInfo.color} border-0 text-xs font-bold rounded-full flex-shrink-0`}>
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {/* Values */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                          <p className="text-green-200/60 text-xs font-medium uppercase mb-1">Ideal</p>
                          <p className="text-white font-bold text-sm">{item.range}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                          <p className="text-green-200/60 text-xs font-medium uppercase mb-1">Your Value</p>
                          <p className="text-white font-bold text-sm">{item.result} {item.unit}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(((item.result / parseFloat(item.range.split(' - ')[1])) * 100), 100)}%` }}
                            transition={{ duration: 1.5, delay: idx * 0.1 }}
                            className={`h-full bg-gradient-to-r ${statusInfo.glow} rounded-full`}
                          />
                        </div>
                      </div>

                      {/* Preview */}
                      <p className="text-cyan-200/70 text-xs leading-relaxed mb-6 flex-1">
                        <span className="text-emerald-300 font-semibold">Cause: </span>
                        {item.cause}
                      </p>

                      {/* Action Button */}
                      <motion.button
                        onClick={() => setExpandedItem(isExpanded ? null : item.name)}
                        className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 hover:from-cyan-500/30 hover:to-emerald-500/20 border border-green-400/40 hover:border-cyan-400/60 text-cyan-300 hover:text-green-200 font-semibold text-sm transition-all flex items-center justify-between"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isExpanded ? "Hide Details" : "View Details"}
                        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="mt-4 space-y-3"
                      >
                        {[
                          { title: "Root Cause", text: item.cause, color: "emerald" },
                          { title: "Health Context", text: item.context, color: "cyan" },
                          { title: "Recommendations", text: item.tips, color: "amber" }
                        ].map((detail, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`rounded-lg bg-${detail.color}-500/15 border border-${detail.color}-400/40 p-4`}
                          >
                            <p className={`text-${detail.color}-300 font-semibold text-sm mb-2`}>{detail.title}</p>
                            <p className={`text-${detail.color}-100 text-xs leading-relaxed`}>{detail.text}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-400/40">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Personalized Wellness Plan</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-amber-500/5" />
              
              <div className="relative p-8 border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-amber-400" />
                  AI Recommendations
                </h3>
                
                <div className="space-y-4">
                  {[
                    { icon: Activity, text: "30+ min daily cardio exercise", priority: "high", emoji: "🏃" },
                    { icon: Heart, text: "Reduce saturated fat by 30%", priority: "high", emoji: "❤️" },
                    { icon: Droplet, text: "Increase water to 8+ liters/day", priority: "medium", emoji: "💧" },
                    { icon: Zap, text: "Morning sunlight (10-15 mins)", priority: "high", emoji: "☀️" }
                  ].map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      whileHover={{ x: 5 }}
                      className={`group flex items-start gap-4 p-4 rounded-xl border transition-all ${
                        rec.priority === "high"
                          ? "bg-red-500/15 border-red-400/40 hover:bg-red-500/20 hover:border-red-400/60"
                          : "bg-blue-500/15 border-blue-400/40 hover:bg-blue-500/20 hover:border-blue-400/60"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{rec.emoji}</span>
                      <div className="flex-1">
                        <p className={`font-semibold ${rec.priority === "high" ? "text-red-100" : "text-blue-100"}`}>
                          {rec.text}
                        </p>
                        <Badge className={`mt-2 rounded-full text-xs font-bold ${
                          rec.priority === "high" ? "bg-red-500/30 text-red-200" : "bg-blue-500/30 text-blue-200"
                        }`}>
                          {rec.priority === "high" ? "🔴 High Priority" : "🔵 Regular"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Lifestyle Tips */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5" />
              
              <div className="relative p-8 border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Brain className="h-6 w-6 text-emerald-400" />
                  Lifestyle Tips
                </h3>
                
                <div className="space-y-4">
                  {[
                    "🧘 10-15 min daily meditation for stress relief",
                    "🥗 25-35g daily fiber in your diet",
                    "😴 Maintain 7-8 hour sleep schedule",
                    "🚴 Light movement every hour"
                  ].map((tip, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 border border-emerald-400/40 hover:border-emerald-400/60 transition-all"
                    >
                      <span className="text-white text-sm leading-relaxed">{tip}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Final Summary - Premium */}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-3xl mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-emerald-500/15 to-teal-500/20 backdrop-blur-lg" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl opacity-50" />
          
          <div className="relative p-10 border border-white/20 rounded-3xl">
            <div className="flex items-start gap-6">
              <Sparkles className="h-8 w-8 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Health Assessment Summary</h3>
                <p className="text-cyan-100/90 leading-relaxed mb-6 text-lg">
                  {extractedData.aiSummary}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {Object.entries(extractedData.healthScore).map(([key, value]) => (
                    <div key={key} className="rounded-lg bg-white/5 border border-white/10 p-4">
                      <p className="text-green-200/60 text-xs font-medium uppercase mb-2">{key}</p>
                      <p className="text-3xl font-bold text-white">{value}</p>
                      <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 2, delay: 0.8 }}
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-cyan-200/80 text-sm">
                  <Shield className="h-4 w-4 inline mr-2 text-emerald-400" />
                  Your data is encrypted and stored securely. Follow high-priority recommendations for optimal health results.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisDetailPage;
