import { useAuth } from "@/hooks/use-auth";
import { useContacts } from "@/hooks/use-contacts";
import { useContent } from "@/hooks/use-content";
import { Redirect } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Edit, Trash2, Brain, Lightbulb, MessageSquare, FileText, Download, Eye, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { data: contacts, isLoading: contactsLoading } = useContacts();
  const { data: contentItems, isLoading: contentLoading, error: contentError, refetch: refetchContent } = useContent();
  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["/api/submissions"],
    queryFn: async () => {
      console.log('Fetching submissions...');
      const res = await fetch("/api/submissions", {
        credentials: "include"
      });
      if (!res.ok) {
        console.error('Failed to fetch submissions');
        throw new Error("Failed to fetch submissions");
      }
      const data = await res.json();
      console.log('Received submissions:', data.length);
      return data;
    },
    enabled: !!isAdmin
  });
  const { toast } = useToast();
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);

  const { data: usersList } = useQuery<any[]>({
    queryKey: [api.auth.users.path],
    enabled: !!isAdmin,
  });

  // Handle content error gracefully
  const contentData = contentError ? [] : (contentItems || []);

  // Content management mutations
  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.content.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData?.message || errorData?.error || "Failed to create content";
        throw new Error(errorMessage);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.content.list.path] });
      toast({ title: "Content added successfully" });
      setShowContentForm(false);
      setEditingContent(null);
    },
    onError: (error: Error) => {
      console.error("Content creation error:", error);
      toast({ 
        title: "Failed to add content", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(api.content.update.path.replace(":id", id.toString()), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData?.message || errorData?.error || "Failed to update content";
        throw new Error(errorMessage);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.content.list.path] });
      toast({ title: "Content updated successfully" });
      setShowContentForm(false);
      setEditingContent(null);
    },
    onError: (error: Error) => {
      console.error("Content update error:", error);
      toast({ 
        title: "Failed to update content", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api.content.delete.path.replace(":id", id.toString()), {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData?.message || errorData?.error || "Failed to delete content";
        throw new Error(errorMessage);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.content.list.path] });
      toast({ title: "Content deleted successfully" });
    },
    onError: (error: Error) => {
      console.error("Content deletion error:", error);
      toast({ 
        title: "Failed to delete content", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  
  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-cream"><Skeleton className="w-64 h-12 bg-ink/10" /></div>;
  if (!user || !isAdmin) return <Redirect to="/" />;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display text-4xl text-ink font-bold mb-2">Chancellor's <span className="text-gold italic">Quarters</span></h1>
          <p className="font-body text-ink/60">Oversee the affairs of LIT'ERA.</p>
        </div>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="bg-ink/5 border border-ink/10 mb-8 p-1 rounded-none h-auto flex-wrap">
            <TabsTrigger value="contacts" className="font-accent tracking-widest uppercase text-xs px-8 py-3 data-[state=active]:bg-gold data-[state=active]:text-ink rounded-none">Missives (Contact)</TabsTrigger>
            <TabsTrigger value="submissions" className="font-accent tracking-widest uppercase text-xs px-8 py-3 data-[state=active]:bg-gold data-[state=active]:text-ink rounded-none">Submissions</TabsTrigger>
            <TabsTrigger value="users" className="font-accent tracking-widest uppercase text-xs px-8 py-3 data-[state=active]:bg-gold data-[state=active]:text-ink rounded-none">Logins (Users)</TabsTrigger>
            <TabsTrigger value="content" className="font-accent tracking-widest uppercase text-xs px-8 py-3 data-[state=active]:bg-gold data-[state=active]:text-ink rounded-none">Content (Thoughts & Riddles)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contacts">
            <div className="bg-white border border-ink/10 p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-ink mb-6">Recent Missives</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-ink/10">
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Date</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Name</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts?.map((contact) => (
                      <TableRow key={contact.id} className="border-ink/5">
                        <TableCell className="font-body">{new Date(contact.submissionDate!).toLocaleDateString()}</TableCell>
                        <TableCell className="font-body font-bold">{contact.name}</TableCell>
                        <TableCell className="font-body text-ink/70 truncate max-w-xs">{contact.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <div className="bg-white border border-ink/10 p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-ink mb-6">Publication Submissions</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-ink/10">
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Date</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Name</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Email</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Title</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Category</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">File</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Status</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  {(() => {
    console.log('Submissions count:', submissions?.length || 0);
    
    if (submissionsLoading) {
      return <div className="flex justify-center py-8"><Skeleton className="w-64 h-12 bg-ink/10" /></div>;
    }
    
    if (!submissions || submissions.length === 0) {
      return <div className="text-center py-8"><p className="font-body text-ink/60">No submissions found.</p></div>;
    }
    
    return (
      <TableBody>
        {submissions.map((submission: any) => {
          console.log('Submission ID:', submission.id, 'FileName:', submission.fileName, 'FileSize:', submission.fileSize);
          return (
            <TableRow key={submission.id} className="border-ink/5">
              <TableCell className="font-body">{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
              <TableCell className="font-body font-bold">{submission.name}</TableCell>
              <TableCell className="font-body text-ink/70">{submission.email}</TableCell>
              <TableCell className="font-body">{submission.title}</TableCell>
              <TableCell className="font-body capitalize">{submission.category}</TableCell>
              <TableCell className="font-body">
                {submission.fileName ? (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gold" />
                    <div>
                      <div className="text-xs font-medium">{submission.originalFileName || submission.fileName}</div>
                      <div className="text-xs text-ink/60">
                        {submission.fileSize ? `${(submission.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-ink/40 text-xs italic">No file</span>
                )}
              </TableCell>
              <TableCell className="font-body">
                <span className={`px-2 py-1 text-xs font-accent uppercase rounded ${
                  submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                  submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {submission.status}
                </span>
              </TableCell>
              <TableCell className="font-body">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-ink text-ink font-accent text-xs hover:bg-ink hover:text-cream"
                    onClick={() => {
                      // View submission details
                      alert(`Submission Details:\n\nTitle: ${submission.title}\nCategory: ${submission.category}\nDescription: ${submission.description}\n\nEmail: ${submission.email}\nStatus: ${submission.status}\n${submission.fileName ? `\nFile: ${submission.fileName} (${(submission.fileSize / 1024 / 1024).toFixed(2)} MB)` : '\nNo file attached'}`);
                    }}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  {submission.fileName && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold text-gold font-accent text-xs hover:bg-gold hover:text-ink"
                      onClick={async () => {
                        try {
                          console.log('Downloading file for submission:', submission.id);
                          
                          const response = await fetch(`/api/submissions/${submission.id}/download`, {
                            credentials: "include"
                          });
                          
                          if (response.ok) {
                            // Create blob from the file response
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = submission.originalFileName || submission.fileName;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                            
                            toast({
                              title: "File Downloaded",
                              description: `Downloaded ${submission.originalFileName || submission.fileName}`,
                            });
                          } else {
                            const errorData = await response.json();
                            throw new Error(errorData.message || "Failed to download file");
                          }
                        } catch (error) {
                          console.error('Download error:', error);
                          toast({
                            title: "Download Failed",
                            description: "Could not download file. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  })()}
                </Table>
              </div>
            </div>
          </TabsContent>

          
          <TabsContent value="users">
            <div className="bg-white border border-ink/10 p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-ink mb-6">Recent Logins</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-ink/10">
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Joined</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Name</TableHead>
                      <TableHead className="font-accent text-ink/50 uppercase tracking-widest text-xs">Club</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersList?.map((u) => (
                      <TableRow key={u.id} className="border-ink/5">
                        <TableCell className="font-body">{new Date(u.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell className="font-body font-bold">{u.name}</TableCell>
                        <TableCell className="font-body text-ink/70">{u.club}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          
          {/* Content Management Tab */}
          <TabsContent value="content">
            <div className="bg-white border border-ink/10 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl font-bold text-ink">Content Management</h2>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => refetchContent()}
                    variant="outline"
                    className="border-ink text-ink hover:bg-ink hover:text-cream font-accent tracking-widest uppercase flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditingContent(null);
                      setShowContentForm(true);
                    }}
                    className="bg-gold text-ink font-accent tracking-widest uppercase flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Content
                  </Button>
                </div>
              </div>

              {showContentForm && (
                <div className="bg-cream border border-ink/10 p-6 mb-6">
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
                        <label className="block font-accent text-sm text-ink mb-2">Content Type</label>
                        <select name="type" className="w-full px-3 py-2 border border-ink/20 rounded-sm bg-white text-ink">
                          <option value="thought">Thought</option>
                          <option value="riddle">Riddle</option>
                          <option value="quote">Quote</option>
                          <option value="fact">Literary Fact</option>
                          <option value="poem">Short Poem</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-accent text-sm text-ink mb-2">Author</label>
                        <Input name="author" defaultValue={editingContent?.author || 'Admin'} className="bg-white border-ink/20" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block font-accent text-sm text-ink mb-2">Title</label>
                      <Input name="title" defaultValue={editingContent?.title || ''} className="bg-white border-ink/20" required />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block font-accent text-sm text-ink mb-2">Content</label>
                      <Textarea name="content" defaultValue={editingContent?.content || ''} rows={4} className="bg-white border-ink/20" required />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block font-accent text-sm text-ink mb-2">Answer (for riddles)</label>
                      <Input name="answer" defaultValue={editingContent?.answer || ''} className="bg-white border-ink/20" placeholder="Optional - for riddles only" />
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        disabled={createContentMutation.isPending || updateContentMutation.isPending}
                        className="bg-gold text-ink font-accent tracking-widest uppercase"
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
                        className="border-ink text-ink font-accent tracking-widest uppercase"
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
              ) : (
                <div className="space-y-4">
                  {contentData.map((item: any) => (
                  <div key={item.id} className="border border-ink/10 p-4 rounded-sm">
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
