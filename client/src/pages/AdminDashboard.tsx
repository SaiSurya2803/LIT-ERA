import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Edit, Trash2, Brain, Lightbulb, MessageSquare, FileText, Download, Eye, RefreshCw, UserCheck, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);

  // 1. Contacts (Missives) Query
  const { 
    data: contacts = [], 
    isLoading: contactsLoading, 
    refetch: refetchContacts 
  } = useQuery<any[]>({
    queryKey: ["/api/contacts"],
    queryFn: async () => {
      const res = await fetch("/api/contacts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
    enabled: !!isAdmin,
  });

  // 2. Submissions Query
  const { 
    data: submissions = [], 
    isLoading: submissionsLoading, 
    refetch: refetchSubmissions 
  } = useQuery<any[]>({
    queryKey: ["/api/submissions"],
    queryFn: async () => {
      const res = await fetch("/api/submissions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch submissions");
      return res.json();
    },
    enabled: !!isAdmin,
  });

  // 3. Users (Logins) Query
  const { 
    data: usersList = [], 
    isLoading: usersLoading, 
    error: usersError,
    refetch: refetchUsers 
  } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      let res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) {
        res = await fetch("/api/users", { credentials: "include" });
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to fetch users (${res.status})`);
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!isAdmin,
    refetchOnWindowFocus: true,
    refetchInterval: 10000, // auto-refresh every 10s
  });

  // 4. Content Query
  const { 
    data: contentItems = [], 
    isLoading: contentLoading, 
    refetch: refetchContent 
  } = useQuery<any[]>({
    queryKey: ["/api/content"],
    queryFn: async () => {
      const res = await fetch("/api/content", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!isAdmin,
  });

  // Content mutations
  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create content");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Content added successfully" });
      setShowContentForm(false);
      setEditingContent(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to add content", description: error.message, variant: "destructive" });
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update content");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Content updated successfully" });
      setShowContentForm(false);
      setEditingContent(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update content", description: error.message, variant: "destructive" });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/content/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete content");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Content deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete content", description: error.message, variant: "destructive" });
    }
  });

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-cream"><Skeleton className="w-64 h-12 bg-ink/10" /></div>;
  if (!user || !isAdmin) return <Redirect to="/" />;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="font-display text-4xl text-ink font-bold mb-2">Chancellor's <span className="text-gold italic">Quarters</span></h1>
            <p className="font-body text-ink/60">Oversee the affairs of LIT'ERA.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-ink/60 bg-white border border-ink/10 px-4 py-2 rounded-sm shadow-sm">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Logged in as: <strong className="text-ink">{user.name}</strong></span>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-ink/5 border border-ink/10 mb-8 p-1 rounded-none h-auto flex-wrap">
            <TabsTrigger value="users" className="font-accent tracking-widest uppercase text-xs px-8 py-3 data-[state=active]:bg-gold data-[state=active]:text-ink rounded-none">Logins (Users)</TabsTrigger>
            <TabsTrigger value="contacts" className="font-accent tracking-widest uppercase text-xs px-8 py-3 data-[state=active]:bg-gold data-[state=active]:text-ink rounded-none">Missives (Contact)</TabsTrigger>
            <TabsTrigger value="submissions" className="font-accent tracking-widest uppercase text-xs px-8 py-3 data-[state=active]:bg-gold data-[state=active]:text-ink rounded-none">Submissions</TabsTrigger>
            <TabsTrigger value="content" className="font-accent tracking-widest uppercase text-xs px-8 py-3 data-[state=active]:bg-gold data-[state=active]:text-ink rounded-none">Content (Thoughts & Riddles)</TabsTrigger>
          </TabsList>
          
          {/* 1. USERS TAB */}
          <TabsContent value="users">
            <div className="bg-white border border-ink/10 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Registered Members</h2>
                  <p className="font-body text-xs text-ink/50 mt-1">Total: {usersList.length} members</p>
                </div>
                <Button 
                  onClick={() => refetchUsers()}
                  variant="outline"
                  size="sm"
                  className="border-ink text-ink hover:bg-ink hover:text-cream font-accent tracking-widest uppercase text-xs flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-ink/10 bg-cream/40">
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Joined</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Name</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Email</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Role</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Club</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Skeleton className="w-64 h-8 bg-ink/10 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : usersError ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="font-body text-red-600 font-medium text-sm">{(usersError as any)?.message || "Failed to load registered members"}</p>
                        </TableCell>
                      </TableRow>
                    ) : usersList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="font-body text-ink/60">No registered members found.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      usersList.map((u) => (
                        <TableRow key={u.id} className="border-ink/5 hover:bg-cream/20">
                          <TableCell className="font-body text-xs">
                            {u.joinDate ? new Date(u.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Recently"}
                          </TableCell>
                          <TableCell className="font-body font-bold text-ink">{u.name}</TableCell>
                          <TableCell className="font-body text-ink/70 text-xs">{u.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 text-[0.65rem] font-accent uppercase tracking-wider rounded ${
                              u.isAdmin ? "bg-gold text-ink font-bold" : "bg-ink/10 text-ink/70"
                            }`}>
                              {u.isAdmin ? "Admin" : "Member"}
                            </span>
                          </TableCell>
                          <TableCell className="font-body text-xs text-ink/60">{u.club || "LIT'ERA"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* 2. CONTACTS TAB */}
          <TabsContent value="contacts">
            <div className="bg-white border border-ink/10 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Recent Missives</h2>
                  <p className="font-body text-xs text-ink/50 mt-1">Total: {contacts.length} messages</p>
                </div>
                <Button 
                  onClick={() => refetchContacts()}
                  variant="outline"
                  size="sm"
                  className="border-ink text-ink hover:bg-ink hover:text-cream font-accent tracking-widest uppercase text-xs flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-ink/10 bg-cream/40">
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Date</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Name</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Email</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Subject</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactsLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Skeleton className="w-64 h-8 bg-ink/10 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : contacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="font-body text-ink/60">No contact messages received yet.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      contacts.map((contact) => (
                        <TableRow key={contact.id} className="border-ink/5 hover:bg-cream/20">
                          <TableCell className="font-body text-xs">
                            {contact.submissionDate ? new Date(contact.submissionDate).toLocaleDateString() : "Recent"}
                          </TableCell>
                          <TableCell className="font-body font-bold text-ink">{contact.name}</TableCell>
                          <TableCell className="font-body text-xs text-ink/70">{contact.email}</TableCell>
                          <TableCell className="font-body text-xs text-gold font-medium">{contact.subject || "General"}</TableCell>
                          <TableCell className="font-body text-sm text-ink/80 max-w-sm">{contact.message}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* 3. SUBMISSIONS TAB */}
          <TabsContent value="submissions">
            <div className="bg-white border border-ink/10 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Publication Submissions</h2>
                  <p className="font-body text-xs text-ink/50 mt-1">Total: {submissions.length} submissions</p>
                </div>
                <Button 
                  onClick={() => refetchSubmissions()}
                  variant="outline"
                  size="sm"
                  className="border-ink text-ink hover:bg-ink hover:text-cream font-accent tracking-widest uppercase text-xs flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-ink/10 bg-cream/40">
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Date</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Author</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Email</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Title</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Category</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">File</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Status</TableHead>
                      <TableHead className="font-accent text-ink/60 uppercase tracking-widest text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissionsLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <Skeleton className="w-64 h-8 bg-ink/10 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : submissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <p className="font-body text-ink/60">No submissions found.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      submissions.map((submission: any) => (
                        <TableRow key={submission.id} className="border-ink/5 hover:bg-cream/20">
                          <TableCell className="font-body text-xs">
                            {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : "Recent"}
                          </TableCell>
                          <TableCell className="font-body font-bold text-ink">{submission.name}</TableCell>
                          <TableCell className="font-body text-xs text-ink/70">{submission.email}</TableCell>
                          <TableCell className="font-body text-sm font-medium">{submission.title}</TableCell>
                          <TableCell className="font-body capitalize text-xs">{submission.category}</TableCell>
                          <TableCell className="font-body text-xs">
                            {submission.fileName ? (
                              <div className="flex items-center gap-1 text-gold">
                                <FileText className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[120px]">{submission.originalFileName || submission.fileName}</span>
                              </div>
                            ) : (
                              <span className="text-ink/40 italic">No file</span>
                            )}
                          </TableCell>
                          <TableCell className="font-body">
                            <span className={`px-2 py-0.5 text-[0.65rem] font-accent uppercase tracking-wider rounded ${
                              submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                              submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {submission.status || 'pending'}
                            </span>
                          </TableCell>
                          <TableCell className="font-body">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-ink text-ink font-accent text-xs hover:bg-ink hover:text-cream h-7 px-2"
                              onClick={() => {
                                alert(`Submission Details:\n\nAuthor: ${submission.name} (${submission.email})\nTitle: ${submission.title}\nCategory: ${submission.category}\nStatus: ${submission.status}\nDescription:\n${submission.description}`);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* 4. CONTENT MANAGEMENT TAB */}
          <TabsContent value="content">
            <div className="bg-white border border-ink/10 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Content Management</h2>
                  <p className="font-body text-xs text-ink/50 mt-1">Manage daily thoughts, literary riddles, and quotes</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => refetchContent()}
                    variant="outline"
                    size="sm"
                    className="border-ink text-ink hover:bg-ink hover:text-cream font-accent tracking-widest uppercase text-xs flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditingContent(null);
                      setShowContentForm(true);
                    }}
                    size="sm"
                    className="bg-gold text-ink font-accent tracking-widest uppercase text-xs flex items-center gap-2 hover:bg-ink hover:text-cream transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Content
                  </Button>
                </div>
              </div>

              {showContentForm && (
                <div className="bg-cream border border-ink/10 p-6 mb-6 rounded-sm">
                  <h3 className="font-display text-xl font-bold text-ink mb-4">
                    {editingContent ? 'Edit Content' : 'Add New Content'}
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const answerValue = formData.get('answer') as string;
                    const contentData = {
                      type: formData.get('type') as string,
                      title: formData.get('title') as string,
                      content: formData.get('content') as string,
                      answer: answerValue && answerValue.trim() !== '' ? answerValue.trim() : null,
                      author: formData.get('author') as string,
                      date: new Date().toISOString().split('T')[0],
                      isActive: true
                    };
                    
                    if (editingContent) {
                      updateContentMutation.mutate({ id: editingContent.id, data: contentData });
                    } else {
                      createContentMutation.mutate(contentData);
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-accent text-xs text-ink mb-2 uppercase tracking-wider">Content Type</label>
                        <select name="type" defaultValue={editingContent?.type || 'thought'} className="w-full px-3 py-2 border border-ink/20 rounded-sm bg-white text-ink text-sm">
                          <option value="thought">Thought</option>
                          <option value="riddle">Riddle</option>
                          <option value="quote">Quote</option>
                          <option value="fact">Literary Fact</option>
                          <option value="poem">Short Poem</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-accent text-xs text-ink mb-2 uppercase tracking-wider">Author</label>
                        <Input name="author" defaultValue={editingContent?.author || user.name || 'Admin'} className="bg-white border-ink/20 text-sm" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block font-accent text-xs text-ink mb-2 uppercase tracking-wider">Title</label>
                      <Input name="title" defaultValue={editingContent?.title || ''} className="bg-white border-ink/20 text-sm" required />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block font-accent text-xs text-ink mb-2 uppercase tracking-wider">Content</label>
                      <Textarea name="content" defaultValue={editingContent?.content || ''} rows={4} className="bg-white border-ink/20 text-sm" required />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block font-accent text-xs text-ink mb-2 uppercase tracking-wider">Answer (for riddles)</label>
                      <Input name="answer" defaultValue={editingContent?.answer || ''} className="bg-white border-ink/20 text-sm" placeholder="Optional - for riddles only" />
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        disabled={createContentMutation.isPending || updateContentMutation.isPending}
                        className="bg-gold text-ink font-accent tracking-widest uppercase text-xs"
                      >
                        {createContentMutation.isPending || updateContentMutation.isPending 
                          ? 'Saving...' 
                          : editingContent ? 'Update' : 'Add'} Content
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowContentForm(false);
                          setEditingContent(null);
                        }}
                        className="border-ink text-ink font-accent tracking-widest uppercase text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {contentLoading ? (
                <div className="flex justify-center py-8">
                  <Skeleton className="w-64 h-12 bg-ink/10" />
                </div>
              ) : contentItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-body text-ink/60">No content items found. Click "Add Content" to create one.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contentItems.map((item: any) => (
                    <div key={item.id} className="border border-ink/10 p-4 rounded-sm hover:border-gold/30 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {item.type === 'thought' && <Brain className="w-4 h-4 text-gold" />}
                            {item.type === 'riddle' && <Lightbulb className="w-4 h-4 text-gold" />}
                            {item.type === 'quote' && <MessageSquare className="w-4 h-4 text-gold" />}
                            <span className="font-accent text-xs text-gold uppercase tracking-widest">{item.type}</span>
                            <span className="text-xs text-ink/60">• {item.date}</span>
                          </div>
                          <h4 className="font-display text-lg font-bold text-ink mb-2">{item.title}</h4>
                          <p className="font-body text-ink/70 mb-2">{item.content}</p>
                          {item.answer && (
                            <p className="font-body text-ink/60 text-sm italic">Answer: {item.answer}</p>
                          )}
                          <p className="font-accent text-xs text-ink/50 mt-2">By: {item.author}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingContent(item);
                              setShowContentForm(true);
                            }}
                            className="border-ink text-ink font-accent text-xs"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              deleteContentMutation.mutate(item.id);
                            }}
                            className="border-red-500 text-red-500 font-accent text-xs hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
