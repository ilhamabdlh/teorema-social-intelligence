import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Campaign, campaigns as mockCampaigns } from "../lib/mock-data";
import { Plus, Search, Eye, Edit, Trash2, Calendar, Target, Users } from "lucide-react";

interface CampaignManagementProps {
  onSelectCampaign: (campaign: Campaign) => void;
}

export function CampaignManagement({ onSelectCampaign }: CampaignManagementProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Form state for creating/editing campaigns
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    postUrls: "",
    type: "product_launch" as Campaign['type'],
    status: "draft" as Campaign['status'],
    start_date: "",
    end_date: "",
    target_audience: "",
    platforms: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      postUrls: "",
      type: "product_launch",
      status: "draft",
      start_date: "",
      end_date: "",
      target_audience: "",
      platforms: ""
    });
  };

  const handleCreate = () => {
    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      postUrls: formData.postUrls.split('\n').filter(url => url.trim()),
      type: formData.type,
      status: formData.status,
      created_date: new Date().toISOString().split('T')[0],
      start_date: formData.start_date,
      end_date: formData.end_date,
      target_audience: formData.target_audience.split(',').map(a => a.trim()),
      platforms: formData.platforms.split(',').map(p => p.trim())
    };

    setCampaigns([...campaigns, newCampaign]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      postUrls: campaign.postUrls.join('\n'),
      type: campaign.type,
      status: campaign.status,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      target_audience: campaign.target_audience.join(', '),
      platforms: campaign.platforms.join(', ')
    });
  };

  const handleUpdate = () => {
    if (!editingCampaign) return;

    const updatedCampaign: Campaign = {
      ...editingCampaign,
      name: formData.name,
      description: formData.description,
      postUrls: formData.postUrls.split('\n').filter(url => url.trim()),
      type: formData.type,
      status: formData.status,
      start_date: formData.start_date,
      end_date: formData.end_date,
      target_audience: formData.target_audience.split(',').map(a => a.trim()),
      platforms: formData.platforms.split(',').map(p => p.trim())
    };

    setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? updatedCampaign : c));
    setEditingCampaign(null);
    resetForm();
  };

  const handleDelete = (campaignId: string) => {
    setCampaigns(campaigns.filter(c => c.id !== campaignId));
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeColor = (type: Campaign['type']) => {
    switch (type) {
      case 'product_launch': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'brand_awareness': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'feature_highlight': return 'bg-green-100 text-green-800 border-green-300';
      case 'crisis_response': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Campaign Management</h3>
          <p className="text-sm text-muted-foreground">Create and manage your monitoring campaigns</p>
        </div>
        
        <Dialog 
          open={isCreateDialogOpen || !!editingCampaign} 
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingCampaign(null);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
              <DialogDescription>
                {editingCampaign ? 'Update campaign details and settings' : 'Set up a new campaign for monitoring post URLs and tracking sentiment'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Campaign Type</Label>
                  <Select value={formData.type} onValueChange={(value: Campaign['type']) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product_launch">Product Launch</SelectItem>
                      <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                      <SelectItem value="feature_highlight">Feature Highlight</SelectItem>
                      <SelectItem value="crisis_response">Crisis Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the purpose and goals of this campaign"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postUrls">Post URLs (one per line)</Label>
                <Textarea
                  id="postUrls"
                  value={formData.postUrls}
                  onChange={(e) => setFormData({ ...formData, postUrls: e.target.value })}
                  placeholder="https://twitter.com/tesla/status/123&#10;https://youtube.com/watch?v=abc&#10;https://reddit.com/r/teslamotors/post"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience (comma-separated)</Label>
                <Input
                  id="target_audience"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="Tech Enthusiasts, EV Adopters, Tesla Owners"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platforms">Platforms (comma-separated)</Label>
                <Input
                  id="platforms"
                  value={formData.platforms}
                  onChange={(e) => setFormData({ ...formData, platforms: e.target.value })}
                  placeholder="Twitter/X, YouTube, Reddit, Instagram"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: Campaign['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingCampaign(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={editingCampaign ? handleUpdate : handleCreate}>
                {editingCampaign ? 'Update' : 'Create'} Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{campaign.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="outline" className={getTypeColor(campaign.type)}>
                      {campaign.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {campaign.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{campaign.start_date} to {campaign.end_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span>{campaign.postUrls.length} post URLs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{campaign.target_audience.length} audiences</span>
                </div>
              </div>

              {/* Post URLs Preview */}
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">Sample Posts:</h5>
                <div className="space-y-1">
                  {campaign.postUrls.slice(0, 2).map((url, index) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded text-muted-foreground truncate">
                      {url}
                    </div>
                  ))}
                  {campaign.postUrls.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{campaign.postUrls.length - 2} more posts
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-1">
                  {campaign.platforms.slice(0, 3).map((platform, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                  {campaign.platforms.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{campaign.platforms.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectCampaign(campaign)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(campaign)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(campaign.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Create your first campaign to start monitoring"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Campaign
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}