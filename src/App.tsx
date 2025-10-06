import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { CampaignManagement } from "./components/CampaignManagement";
import { BrandManagement } from "./components/BrandManagement";
import { ContentManagement } from "./components/ContentManagement";
import { AnalysisView } from "./components/AnalysisView";
import { Campaign, Brand, Content } from "./lib/mock-data";
import { 
  BarChart3, 
  Calendar,
  RefreshCw,
  Target,
  Building2,
  FileText
} from "lucide-react";
import logoSocialInt from "./assets/logo_socialint.png";

export default function App() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState("campaign-analysis");
  const [activeSubTab, setActiveSubTab] = useState("management");
  
  // Selected entities for analysis
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In a real app, this would trigger data refresh
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveSubTab("analysis");
  };

  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setActiveSubTab("analysis");
  };

  const handleSelectContent = (content: Content) => {
    setSelectedContent(content);
    setActiveSubTab("analysis");
  };

  const handleBackToManagement = () => {
    setSelectedCampaign(null);
    setSelectedBrand(null);
    setSelectedContent(null);
    setActiveSubTab("management");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={logoSocialInt} 
                  alt="Social Intelligence Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className="text-2xl font-bold">Social Intelligence Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Comprehensive content, brand, and campaign monitoring</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                Live
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
            <TabsTrigger value="campaign-analysis" className="flex items-center space-x-2">
              <img src={logoSocialInt} alt="Logo" className="h-4 w-4 object-contain" />
              <span>Campaign Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="brand-analysis" className="flex items-center space-x-2">
              <img src={logoSocialInt} alt="Logo" className="h-4 w-4 object-contain" />
              <span>Brand Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="content-analysis" className="flex items-center space-x-2">
              <img src={logoSocialInt} alt="Logo" className="h-4 w-4 object-contain" />
              <span>Content Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaign-analysis" className="space-y-6">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Campaign Analysis</h2>
                  <p className="text-sm text-muted-foreground">Monitor and analyze marketing campaigns</p>
                </div>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="management">Management</TabsTrigger>
                  <TabsTrigger value="analysis" disabled={!selectedCampaign}>Analysis</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="management">
                <CampaignManagement onSelectCampaign={handleSelectCampaign} />
              </TabsContent>
              
              <TabsContent value="analysis">
                {selectedCampaign && (
                  <AnalysisView 
                    entity={selectedCampaign}
                    entityType="campaign"
                    onBack={handleBackToManagement}
                  />
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="brand-analysis" className="space-y-6">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Brand Analysis</h2>
                  <p className="text-sm text-muted-foreground">Track brand perception and competitive landscape</p>
                </div>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="management">Management</TabsTrigger>
                  <TabsTrigger value="analysis" disabled={!selectedBrand}>Analysis</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="management">
                <BrandManagement onSelectBrand={handleSelectBrand} />
              </TabsContent>
              
              <TabsContent value="analysis">
                {selectedBrand && (
                  <AnalysisView 
                    entity={selectedBrand}
                    entityType="brand"
                    onBack={handleBackToManagement}
                  />
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="content-analysis" className="space-y-6">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Content Analysis</h2>
                  <p className="text-sm text-muted-foreground">Analyze individual posts and content performance</p>
                </div>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="management">Management</TabsTrigger>
                  <TabsTrigger value="analysis" disabled={!selectedContent}>Analysis</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="management">
                <ContentManagement onSelectContent={handleSelectContent} />
              </TabsContent>
              
              <TabsContent value="analysis">
                {selectedContent && (
                  <AnalysisView 
                    entity={selectedContent}
                    entityType="content"
                    onBack={handleBackToManagement}
                  />
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 Social Intelligence Dashboard. Comprehensive content monitoring and analysis.</p>
            <div className="flex items-center space-x-4">
              <span>Data sources: Twitter/X, Reddit, YouTube, LinkedIn, TikTok, Instagram</span>
              <Badge variant="outline" className="text-xs">
                Beta
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}