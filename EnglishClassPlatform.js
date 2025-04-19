
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const supabase = createClient(
  "https://chemlexsphooxgjajapc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZW1sZXhzcGhvb3hnamFqYXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODQ0MjksImV4cCI6MjA2MDY2MDQyOX0.ShWXQAaCjOpDWoEzRECEzAZdLfnwAQy8-H3R5LYwBNM"
);

export default function EnglishClassPlatform() {
  const [student, setStudent] = useState({
    name: '',
    email: '',
    remainingClasses: 0,
    paymentStatus: '',
    classHistory: []
  });
  const [emailInput, setEmailInput] = useState('');
  const [newClassDate, setNewClassDate] = useState('');
  const [loaded, setLoaded] = useState(false);

  const fetchStudent = async (email) => {
    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single();

    if (data) {
      setStudent(data);
      setLoaded(true);
    }
  };

  const handleAddClass = async () => {
    if (!newClassDate || !student.id) return;
    const updatedHistory = [...student.classHistory, newClassDate];
    const { data } = await supabase
      .from('students')
      .update({
        classHistory: updatedHistory,
        remainingClasses: Math.max(0, student.remainingClasses - 1)
      })
      .eq('id', student.id)
      .select('*')
      .single();

    if (data) {
      setStudent(data);
      setNewClassDate('');
    }
  };

  const handlePayment = async () => {
    const { data } = await supabase
      .from('students')
      .update({ paymentStatus: 'paid' })
      .eq('id', student.id)
      .select('*')
      .single();

    if (data) {
      setStudent(data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-center">
        <Image src="/logo-safemind.jpeg" alt="Logo SafeMind" width={150} height={150} />
      </div>
      <h1 className="text-2xl font-bold text-center">Safe Mind - English Class Portal</h1>

      <Tabs defaultValue="student" className="space-y-4">
        <TabsList className="flex justify-center gap-4">
          <TabsTrigger value="student">Área do Aluno</TabsTrigger>
          <TabsTrigger value="admin">Área do Professor</TabsTrigger>
        </TabsList>

        <TabsContent value="student">
          <Card>
            <CardContent className="space-y-4 p-4">
              <div>
                <label className="block mb-1">Seu Email</label>
                <Input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Digite seu e-mail"
                />
                <Button onClick={() => fetchStudent(emailInput)}>Acessar</Button>
              </div>
              {loaded && (
                <>
                  <div>
                    <p><strong>Nome:</strong> {student.name}</p>
                    <p><strong>Aulas Restantes:</strong> {student.remainingClasses}</p>
                    <p><strong>Status de Pagamento:</strong> {student.paymentStatus}</p>
                  </div>
                  {student.paymentStatus !== 'paid' && (
                    <Button onClick={handlePayment}>Realizar Pagamento</Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardContent className="space-y-4 p-4">
              <p className="font-semibold">Histórico de Aulas de {student.name}</p>
              <ul className="list-disc list-inside">
                {student.classHistory.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
              <div className="space-y-2">
                <label className="block">Nova Aula (Data)</label>
                <Input
                  type="date"
                  value={newClassDate}
                  onChange={(e) => setNewClassDate(e.target.value)}
                />
                <Button onClick={handleAddClass}>Registrar Aula</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
