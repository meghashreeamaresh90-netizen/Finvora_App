import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CitizenLayout } from './components/CitizenLayout';
import { FinvoraProvider } from './context/FinvoraContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AssistantPage } from './pages/AssistantPage';
import { BanksPage } from './pages/BanksPage';
import { CalculatorsPage } from './pages/CalculatorsPage';
import { DashboardPage } from './pages/DashboardPage';
import { GoalsPage } from './pages/GoalsPage';
import { HelpHubPage } from './pages/HelpHubPage';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { MoneyTrackerPage } from './pages/MoneyTrackerPage';
import { ScamRescuePage } from './pages/ScamRescuePage';
import { SchemesPage } from './pages/SchemesPage';
import { UpiGuidePage } from './pages/UpiGuidePage';

function withCitizenLayout(element: React.ReactNode) {
  return <CitizenLayout>{element}</CitizenLayout>;
}

export default function App() {
  return (
    <FinvoraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={withCitizenLayout(<HomePage />)} />
          <Route path="/learn" element={withCitizenLayout(<LearnPage />)} />
          <Route path="/upi-guide" element={withCitizenLayout(<UpiGuidePage />)} />
          <Route path="/money" element={withCitizenLayout(<MoneyTrackerPage />)} />
          <Route path="/goals" element={withCitizenLayout(<GoalsPage />)} />
          <Route path="/schemes" element={withCitizenLayout(<SchemesPage />)} />
          <Route path="/schemes/:schemeId" element={withCitizenLayout(<SchemesPage />)} />
          <Route path="/calculators" element={withCitizenLayout(<CalculatorsPage />)} />
          <Route path="/scam-rescue" element={withCitizenLayout(<ScamRescuePage />)} />
          <Route path="/assistant" element={withCitizenLayout(<AssistantPage />)} />
          <Route path="/banks" element={withCitizenLayout(<BanksPage />)} />
          <Route path="/dashboard" element={withCitizenLayout(<DashboardPage />)} />
          <Route path="/help" element={withCitizenLayout(<HelpHubPage />)} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </FinvoraProvider>
  );
}
