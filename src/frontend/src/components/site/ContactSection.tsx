import { useState } from 'react';
import { useSubmitContactForm } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MapPin, Mail, MessageCircle } from 'lucide-react';
import { SiYoutube } from 'react-icons/si';
import { toast } from 'sonner';
import { CONTACT } from '../../constants/contact';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const submitMutation = useSubmitContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await submitMutation.mutateAsync({ name, phone, message });
      toast.success('Message sent successfully! We will get back to you soon.');
      setName('');
      setPhone('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or need our services? Contact us today!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill out the form and we'll get back to you shortly</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                    {submitMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Phone Numbers</p>
                    {CONTACT.whatsappNumbers.map((item, index) => (
                      <a
                        key={index}
                        href={`tel:${item.number}`}
                        className="text-muted-foreground hover:text-primary block"
                      >
                        {item.display}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    {CONTACT.whatsappNumbers.map((item, index) => (
                      <a
                        key={index}
                        href={item.waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary block"
                      >
                        Chat: {item.display}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">WhatsApp Channel</p>
                    <a
                      href={CONTACT.whatsappChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Join our channel
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <SiYoutube className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">YouTube Channel</p>
                    <a
                      href={CONTACT.youtubeChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Subscribe to our channel
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{CONTACT.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
