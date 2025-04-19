import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

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
  const [activeTab, setActiveTab] = useState('student');
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Image src="/logo-safemind.jpeg" alt="Logo SafeMind" width={150} height={150} />
      </div>
      <h1 style={{ textAlign: 'center' }}>Safe Mind - English Class Portal</h1>
      <Tabs defaultValue="student">
        <TabsList>
          <TabsTrigger value="student" activeTab={activeTab} setActiveTab={setActiveTab}>Área do Aluno</TabsTrigger>
          <TabsTrigger value="admin" activeTab={activeTab} setActiveTab={setActiveTab}>Área do Professor</TabsTrigger>
        </TabsList>

        <TabsContent value="student" activeTab={activeTab}>
          <Card>
            <CardContent>
              <div>
                <label>Email do aluno</label>
                <Input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Digite seu e-mail"
                />
                <Button onClick={() => fetchStudent(emailInput)}>Acessar</Button>
              </div>
              {loaded && (
                <>
                  <p><strong>Nome:</strong> {student.name}</p>
                  <p><strong>Aulas Restantes:</strong> {student.remainingClasses}</p>
                  <p><strong>Status de Pagamento:</strong> {student.paymentStatus}</p>
                  {student.paymentStatus !== 'paid' && (
                    <Button onClick={handlePayment}>Realizar Pagamento</Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" activeTab={activeTab}>
          <Card>
            <CardContent>
              <p><strong>Histórico de Aulas de {student.name}</strong></p>
              <ul>
                {student.classHistory.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
              <div>
                <label>Nova Aula (Data)</label>
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
