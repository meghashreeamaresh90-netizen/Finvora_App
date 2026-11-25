import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Download,
  Globe,
  Plus,
  RotateCcw,
  ShieldAlert,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MicButton } from '../components/MicButton';
import { VoiceAssistantDrawer } from '../components/VoiceAssistantDrawer';
import { useFinvora } from '../context/FinvoraContext';
import { LEARN_CATEGORIES } from '../data/seedData';
import { localizeLesson, localizeScamReport } from '../i18n/localizedSeedData';
import { SCREEN_STRINGS } from '../i18n/screenStrings';
import { LANGUAGES } from '../i18n/translations';
import { LearnCategoryId } from '../types/finvora';

const BAR_COLORS = ['#16A34A', '#F97316', '#0EA5E9', '#FACC15', '#166534', '#8B5CF6'];

export const AdminDashboardPage: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    lessons,
    completedLessonIds,
    offlineLessonIds,
    scamReports,
    toggleScamReportStatus,
    languageUsage,
    addCustomLesson,
    resetDemoData,
  } = useFinvora();

  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;

  const [reportFilter, setReportFilter] = useState<'All' | 'Pending' | 'Resolved'>('All');
  const [showAddLesson, setShowAddLesson] = useState(false);

  // Add lesson form state
  const [categoryId, setCategoryId] = useState<LearnCategoryId>('savings');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [keyTip, setKeyTip] = useState('');
  const [lessonAddedBanner, setLessonAddedBanner] = useState(false);

  const categoryLabels: Record<LearnCategoryId, string> = {
    savings: t.catSavings,
    budgeting: t.catBudgeting,
    banking: t.catBanking,
    loans: t.catLoans,
    insurance: t.catInsurance,
    'digital-payments': t.catDigital,
  };

  const verdictLabel = (verdict: 'SAFE' | 'SUSPICIOUS' | 'SCAM') => {
    if (verdict === 'SCAM') return t.verdictScam;
    if (verdict === 'SAFE') return t.verdictSafe;
    return t.verdictSuspicious;
  };

  const filteredReports = useMemo(() => {
    if (reportFilter === 'All') return scamReports;
    return scamReports.filter((r) => r.status === reportFilter);
  }, [scamReports, reportFilter]);

  const langChartData = useMemo(
    () =>
      LANGUAGES.map((lang) => ({
        name: language === 'en' ? lang.english : lang.native,
        native: lang.native,
        users: languageUsage[lang.code] || 0,
      })),
    [languageUsage, language]
  );

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;
    const steps = stepsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    addCustomLesson({
      categoryId,
      title: title.trim(),
      summary: summary.trim(),
      steps: steps.length > 0 ? steps : [summary.trim()],
      keyTip: keyTip.trim() || s.rememberTip,
    });

    setTitle('');
    setSummary('');
    setStepsText('');
    setKeyTip('');
    setShowAddLesson(false);
    setLessonAddedBanner(true);
    setTimeout(() => setLessonAddedBanner(false), 4000);
  };

  const pendingCount = scamReports.filter((r) => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#166534] text-white flex-col justify-between p-5 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center font-extrabold text-xl">
              ₹
            </div>
            <div>
              <div className="text-xl font-extrabold leading-none">{s.brandShort}</div>
              <div className="text-xs text-[#DCFCE7] mt-1">{s.adminTitle}</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            <a
              href="#overview"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 font-bold text-base"
            >
              <Users className="w-5 h-5" />
              <span>{s.adminOverview}</span>
            </a>
            <a
              href="#scam-reports"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 font-semibold text-base"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>
                {s.adminScamReports} ({pendingCount})
              </span>
            </a>
            <a
              href="#language-chart"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 font-semibold text-base"
            >
              <Globe className="w-5 h-5" />
              <span>{s.adminLanguageReach}</span>
            </a>
            <a
              href="#lessons-manager"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 font-semibold text-base"
            >
              <BookOpen className="w-5 h-5" />
              <span>
                {s.adminLessonsNav} ({lessons.length})
              </span>
            </a>
          </nav>
        </div>

        <div className="space-y-2.5">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-[#166534] font-bold text-sm hover:bg-[#ECFDF5] px-2 text-center"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>{s.backToCitizen}</span>
          </Link>
          <button
            type="button"
            onClick={resetDemoData}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/30 text-white/90 text-xs font-semibold hover:bg-white/10 px-2"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>{s.resetDemoData}</span>
          </button>
        </div>
      </aside>

      {/* Main Desktop Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Language Switcher */}
        <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#ECFDF5] text-[#166534] font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{s.backToCitizen}</span>
            </Link>
            <div>
              <p className="text-xs font-bold text-[#64748B] tracking-wider">
                {s.adminSubtitle}
              </p>
              <h1 className="text-[24px] font-extrabold text-[#0F172A]">
                {s.adminTitle}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F5F9] p-1.5 rounded-xl">
              {LANGUAGES.map((lang) => {
                const active = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`min-h-[36px] px-3 rounded-lg text-sm font-bold transition-colors ${
                      active
                        ? 'bg-[#166534] text-white shadow-sm'
                        : 'text-[#334155] hover:bg-white'
                    }`}
                  >
                    {lang.native}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowAddLesson((prev) => !prev)}
              className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-base shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>{s.addNewLessonBtn}</span>
            </button>
          </div>
        </header>

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6 pb-24">
          {lessonAddedBanner && (
            <div className="rounded-xl bg-[#ECFDF5] border-2 border-[#16A34A] p-4 flex items-center justify-between gap-3">
              <span className="font-bold text-[#166534] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {s.lessonPublishedBanner}
              </span>
              <Link to="/learn" className="font-extrabold text-[#166534] underline">
                {s.viewInLearn} →
              </Link>
            </div>
          )}

          {/* Add New Lesson Panel */}
          {showAddLesson && (
            <section className="rounded-2xl bg-white border-2 border-[#166534] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-extrabold text-[#166534]">
                  {s.publishLessonTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddLesson(false)}
                  className="text-sm font-bold text-[#64748B] hover:text-[#0F172A]"
                >
                  {s.closeWord}
                </button>
              </div>
              <form onSubmit={handleAddLesson} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">{s.lessonCategoryLabel}</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value as LearnCategoryId)}
                    className="w-full h-12 rounded-xl border border-[#CBD5E1] px-3 text-base font-semibold"
                  >
                    {LEARN_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {categoryLabels[c.id]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">{s.lessonTitleLabel}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={s.lessonTitleLabel}
                      className="w-full h-12 rounded-xl border border-[#CBD5E1] px-3 text-base"
                    />
                    <MicButton compact onTranscript={(text) => setTitle(text)} />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">{s.lessonSummaryLabel}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder={s.lessonSummaryLabel}
                      className="w-full h-12 rounded-xl border border-[#CBD5E1] px-3 text-base"
                    />
                    <MicButton compact onTranscript={(text) => setSummary(text)} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-bold">{s.lessonStepsLabel}</label>
                    <MicButton
                      compact
                      onTranscript={(text) =>
                        setStepsText((prev) => (prev ? `${prev}\n${text}` : text))
                      }
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={stepsText}
                    onChange={(e) => setStepsText(e.target.value)}
                    placeholder={s.lessonStepsLabel}
                    className="w-full rounded-xl border border-[#CBD5E1] p-3 text-base"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-bold">{s.lessonTipLabel}</label>
                    <MicButton compact onTranscript={(text) => setKeyTip(text)} />
                  </div>
                  <textarea
                    rows={3}
                    value={keyTip}
                    onChange={(e) => setKeyTip(e.target.value)}
                    placeholder={s.lessonTipLabel}
                    className="w-full rounded-xl border border-[#CBD5E1] p-3 text-base"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="min-h-[48px] px-6 rounded-xl bg-[#166534] text-white font-bold text-base hover:bg-[#14532D]"
                  >
                    {s.publishNowBtn}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* 4 Stat Cards */}
          <section id="overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5">
              <div className="flex items-center justify-between text-sm font-semibold text-[#64748B]">
                <span>{s.statActiveLearners}</span>
                <Users className="w-5 h-5 text-[#16A34A]" />
              </div>
              <p className="text-[30px] font-extrabold text-[#0F172A] tabular-nums mt-2">
                1,580
              </p>
              <p className="text-xs font-semibold text-[#16A34A] mt-1">
                {s.statActiveLearnersSub}
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5">
              <div className="flex items-center justify-between text-sm font-semibold text-[#64748B]">
                <span>{s.statTotalLessons}</span>
                <BookOpen className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <p className="text-[30px] font-extrabold text-[#0F172A] tabular-nums mt-2">
                {lessons.length}
              </p>
              <p className="text-xs font-semibold text-[#0EA5E9] mt-1">
                {completedLessonIds.length} {s.statLessonsCompletedSub}
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5">
              <div className="flex items-center justify-between text-sm font-semibold text-[#64748B]">
                <span>{s.statScamsReported}</span>
                <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
              </div>
              <p className="text-[30px] font-extrabold text-[#DC2626] tabular-nums mt-2">
                {scamReports.length}
              </p>
              <p className="text-xs font-semibold text-[#64748B] mt-1">
                {pendingCount} {s.statPendingReviewSub}
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5">
              <div className="flex items-center justify-between text-sm font-semibold text-[#64748B]">
                <span>{s.statOfflineDownloads}</span>
                <Download className="w-5 h-5 text-[#F97316]" />
              </div>
              <p className="text-[30px] font-extrabold text-[#0F172A] tabular-nums mt-2">
                {offlineLessonIds.length}
              </p>
              <p className="text-xs font-semibold text-[#475569] mt-1">
                {s.statZeroNetworkSub}
              </p>
            </div>
          </section>

          {/* Scam Reports Table + Language Usage Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Scam Reports Table */}
            <section
              id="scam-reports"
              className="xl:col-span-2 rounded-2xl bg-white border border-[#E2E8F0] p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[20px] font-extrabold text-[#0F172A]">
                  {s.communityScamReports}
                </h2>
                <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl">
                  {(['All', 'Pending', 'Resolved'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setReportFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                        reportFilter === status
                          ? 'bg-white text-[#0F172A] shadow-sm'
                          : 'text-[#475569]'
                      }`}
                    >
                      {s.statusFilterLabels[status]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-xs font-bold text-[#64748B]">
                      <th className="py-3 pr-3">{s.colReporter}</th>
                      <th className="py-3 pr-3">{s.colMessage}</th>
                      <th className="py-3 pr-3">{s.colVerdict}</th>
                      <th className="py-3 pr-3">{s.colDate}</th>
                      <th className="py-3 text-right">{s.colStatusToggle}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] text-sm">
                    {filteredReports.map((rawReport) => {
                      const report = localizeScamReport(rawReport, language);
                      return (
                        <tr key={report.id} className="hover:bg-[#F8FAFC]">
                          <td className="py-3.5 pr-3 align-top">
                            <div className="font-bold text-[#0F172A]">{report.reportedBy}</div>
                            <div className="text-xs text-[#64748B]">{report.location}</div>
                          </td>
                          <td className="py-3.5 pr-3 align-top max-w-xs">
                            <p className="text-[#0F172A] font-medium line-clamp-2">
                              {report.message}
                            </p>
                          </td>
                          <td className="py-3.5 pr-3 align-top">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-xs font-extrabold ${
                                report.verdict === 'SCAM'
                                  ? 'bg-[#FEE2E2] text-[#991B1B]'
                                  : report.verdict === 'SAFE'
                                  ? 'bg-[#DCFCE7] text-[#166534]'
                                  : 'bg-[#FEF3C7] text-[#92400E]'
                              }`}
                            >
                              {verdictLabel(report.verdict)}
                            </span>
                          </td>
                          <td className="py-3.5 pr-3 align-top tabular-nums text-[#475569] whitespace-nowrap">
                            {report.date}
                          </td>
                          <td className="py-3.5 align-top text-right">
                            <button
                              type="button"
                              onClick={() => toggleScamReportStatus(report.id)}
                              className={`min-h-[38px] px-3.5 rounded-xl font-bold text-xs border transition-colors whitespace-nowrap ${
                                report.status === 'Resolved'
                                  ? 'bg-[#ECFDF5] border-[#16A34A] text-[#166534]'
                                  : 'bg-[#FFF7ED] border-[#F97316] text-[#9A3412]'
                              }`}
                            >
                              {report.status === 'Resolved'
                                ? `${s.resolvedCheck} ✓`
                                : s.markResolvedBtn}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Language Usage Chart */}
            <section
              id="language-chart"
              className="rounded-2xl bg-white border border-[#E2E8F0] p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-[20px] font-extrabold text-[#0F172A]">
                  {s.langDistTitle}
                </h2>
                <p className="text-sm text-[#64748B] mt-0.5">
                  {s.langDistSub}
                </p>
              </div>
              <div className="h-[260px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={langChartData} layout="vertical" margin={{ left: 12, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={78}
                      tick={{ fontSize: 13, fontWeight: 600 }}
                    />
                    <Tooltip />
                    <Bar dataKey="users" radius={[0, 8, 8, 0]}>
                      {langChartData.map((entry, idx) => (
                        <Cell key={entry.name} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* Lessons Inventory Table */}
          <section
            id="lessons-manager"
            className="rounded-2xl bg-white border border-[#E2E8F0] p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-extrabold text-[#0F172A]">
                {s.publishedLessonsHeading} ({lessons.length})
              </h2>
              <Link
                to="/learn"
                className="text-sm font-bold text-[#166534] hover:underline"
              >
                {s.openCitizenLearn} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lessons.slice(0, 6).map((rawLesson) => {
                const l = localizeLesson(rawLesson, language);
                return (
                  <div
                    key={l.id}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#166534]">
                      <span>{categoryLabels[l.categoryId]}</span>
                      {l.isCustom && (
                        <span className="px-2 py-0.5 rounded bg-[#FACC15] text-[#0F172A]">
                          {s.newTag}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-base text-[#0F172A]">{l.title}</p>
                    <p className="text-xs text-[#475569] line-clamp-2">{l.summary}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* Persistent Voice Mic on Admin Console too */}
      <VoiceAssistantDrawer />
    </div>
  );
};
