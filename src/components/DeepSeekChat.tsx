import React, { useState, useRef, useEffect, FormEvent } from 'react';

// --- Interfaces de type ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CreatedDossier { 
    code: string;
    objet: string; 
    // ...
}

export default function DeepSeekChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastCreatedDossierCode, setLastCreatedDossierCode] = useState<string | null>(null); // Pour suivre le dossier à enrichir
    const chatEndRef = useRef<HTMLDivElement>(null);

    // ⚠️ IMPORTANT : Configurez l'URL de votre API Symfony ici.
    const SYMFONY_API_URL = "https://localhost:8000"; 

    // --- Gestion du défilement ---
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const updateChat = (role: 'assistant' | 'user', content: string) => {
        setMessages(prev => [...prev, { role, content }]);
    };
    
    // --------------------------------------------------
    // 1. FONCTION DE CRÉATION DE DOSSIER (Appel à Symfony)
    // --------------------------------------------------

    const createDossier = async (description: string) => {
        // NOTE: Implémentez la logique d'authentification réelle (JWT, Session)
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjI0ODY1NDUsImV4cCI6MTc2MjU3Mjk0NSwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluQHlvcG1haWwuY29tIn0.oeg7HlCQio96G9LZ2eTlz2FgeRDBzO8az5O33mboNosNnWLZCzwrDi38aioHAUFGsHoMBuacDZIol_jHF1Ol9uFWy0L5dT366MzWFQwiTFtMPizcEeEo0mhJ-m0GK1kFaSVcmFIMosH39wmcBP7NqdZ5xuUkhxbELIb4sExBYCy2zbfKxopRaPMvVgAeLuVUcoH7A_xA8ZVMjfQzQ0MGLreRBCvURuD0xAZjHaWtC4CsDTYO3ZaLDZsoaKh9suXbbbG6Gg6gtuumaobu7d4Z7jJydanEwp81pM2JMR0cD3a9aD-HLJzOg6ST-LqK44FbcRwEkgWDxQb3L0KKBvpwB-ucTMWQNI7xMICYh5fWNYL_w3l0FuWKTkivUwi_ETol2nJmicvvd3OC_5D__L3mCMe0nEJlgSQU5zAMsxPngQbuwSlYKwGIp5Hqg5OXEebchSJmWP_n2xr5RfEm_00n9-DDFUSEFoGWVePNLsVaowk4nWoA-A4f-OQqfiEo7uHm-kMyfyPynO8y8KOiGkUhu-LDuKhw2MVK4nzq5bcN5qzM4x467cJs1JrdjIzeoMKsFt8cAlqTrebFQ_hIt-7JbNF-HDPpSeSTfT3AqU2PcI7QOkYbmAeXi3R46POGACrU6mJGIQdF-gvfNJsTpwirz9EAtWm16ggct62s48qS3aA"; 

        if (loading) return;

        try {
            setLoading(true);
            setError('');
            setLastCreatedDossierCode(null); // Réinitialiser avant de créer
            
            updateChat('assistant', "⏳ Envoi du cas à l'IA pour l'analyse et la création du dossier...");
            
            const response = await fetch(`${SYMFONY_API_URL}/api/dossiers/create-dossier`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ description: description })
            });

            const data: CreatedDossier & { detail?: string; error?: string } = await response.json();

            if (!response.ok) {
                const errorMessage = data.detail || data.error || `Erreur Symfony: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            // SUCCESS : Stocker le code et afficher la confirmation
            setLastCreatedDossierCode(data.code); 
            
            updateChat('assistant', `✅ **Dossier créé avec succès !**
                
Code: **${data.code}**
Objet: **${data.objet}**
                
Cliquez sur le bouton ci-dessous pour lancer l'enrichissement par la recherche de lois et décisions (Précédents Juridiques).`);
            
            return data;

        } catch (e: any) {
            const displayError = e.message || "Échec inattendu de la création du dossier.";
            setError(displayError);
            updateChat('assistant', `❌ **Erreur lors de la création du dossier :** ${displayError}`);

        } finally {
            setLoading(false);
        }
    };


    // -------------------------------------------------------------------------
    // 2. NOUVELLE FONCTION : Lancer l'Enrichissement (Lois et Décisions)
    // -------------------------------------------------------------------------

    const enrichDossier = async (dossierCode: string) => {
        const token = "VOTRE_TOKEN_JWT_OU_SESSION_ID"; 
        if (loading) return;

        setLoading(true);
        setError('');

        try {
            updateChat('assistant', `🔎 Début de l'analyse approfondie du dossier **${dossierCode}**...`);

            // --- ÉTAPE A : Recherche des Lois et Articles (Base de lois) ---
            updateChat('assistant', '⏱️ Recherche des lois et articles applicables...');
            let response = await fetch(`${SYMFONY_API_URL}/api/dossiers/${dossierCode}/loi_article`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Échec de la recherche de lois et articles.");
            // On s'attend à ce que l'action soit effectuée côté backend
            
            updateChat('assistant', '✅ Lois et articles identifiés.');

            // --- ÉTAPE B : Recherche des Précédents Juridiques (Gestion des décisions) ---
            updateChat('assistant', '⏱️ Recherche des précédents et jurisprudences pertinents...');
            response = await fetch(`${SYMFONY_API_URL}/api/dossiers/${dossierCode}/precedent_juridique`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Échec de la recherche de précédents juridiques.");
            // On s'attend à ce que l'action soit effectuée côté backend
            
            updateChat('assistant', `✨ **Dossier ${dossierCode} ENRICHI !**
            
Vous pouvez maintenant consulter les **lois**, **articles** et **décisions judiciaires** recommandés dans le module 'Gestion des dossiers'.`);

            setLastCreatedDossierCode(null); // Cache le bouton d'enrichissement après l'action

        } catch (e: any) {
            updateChat('assistant', `❌ **Erreur d'enrichissement** : ${e.message || "Problème de communication avec le serveur."}`);
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // 3. FONCTION D'ENVOI GÉNÉRALE (Gère Chat vs Commande)
    // --------------------------------------------------
    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const trimmedInput = input.trim();
        const newUserMessage: Message = { role: 'user', content: trimmedInput };
        setMessages((prev) => [...prev, newUserMessage]);
        setInput(''); // Vider l'input immédiatement

        // --- Détection de la COMMANDE /nouveau-dossier ---
        if (trimmedInput.startsWith('/nouveau-dossier')) {
            const description = trimmedInput.substring('/nouveau-dossier'.length).trim();
            if (!description) {
                updateChat('assistant', `⚠️ Commande incomplète. Format : \`/nouveau-dossier [description détaillée du cas]\``);
            } else {
                await createDossier(description);
            }
            return;
        }

        // --- LOGIQUE PAR DÉFAUT (Appel API Chat) ---
        try {
            setLoading(true);
            
            // NOTE : L'appel au Route Handler /api/deepseek/route.ts doit être fait ici.
            // ... Votre logique de fetch vers '/api/deepseek' ...
            
            // Simulation de la réponse du chat
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            const aiResponse: Message = {
                role: 'assistant',
                content: `Je suis l'assistant de chat. Utilisez la commande **/nouveau-dossier** pour l'analyse de cas.`
            };
            setMessages((prev) => [...prev, aiResponse]);
            
        } catch (error) {
            updateChat('assistant', "Erreur lors de la communication avec l'IA de chat.");
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // 4. RENDU (Le JSX)
    // --------------------------------------------------
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', maxWidth: '800px', margin: '20px auto', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
                <h3>💬 Avocat-ai Assist Chat</h3>
            </div>
            
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ 
                        marginBottom: '15px', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        backgroundColor: msg.role === 'user' ? '#e6f7ff' : '#f0f0f0', 
                        marginLeft: msg.role === 'user' ? 'auto' : '0',
                        marginRight: msg.role === 'user' ? '0' : 'auto',
                        maxWidth: '85%',
                        textAlign: msg.role === 'user' ? 'right' : 'left',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <strong>{msg.role === 'user' ? 'Vous' : 'Assist'} : </strong>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    </div>
                ))}
                
                {/* 🚨 BOUTON D'ENRICHISSEMENT APPARAÎT APRÈS LA CRÉATION */}
                {lastCreatedDossierCode && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <button 
                            onClick={() => enrichDossier(lastCreatedDossierCode)} 
                            disabled={loading}
                            style={{ padding: '10px 20px', backgroundColor: loading ? '#aaa' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Analyse en cours...' : `▶️ Lancer l'enrichissement de ${lastCreatedDossierCode}`}
                        </button>
                    </div>
                )}

                {loading && (
                    <div style={{ padding: '8px', color: '#007bff', fontStyle: 'italic' }}>
                        Avocat-ai Assist est en cours d'analyse...
                    </div>
                )}
                {error && <div style={{ color: 'red', padding: '8px' }}>Erreur: {error}</div>}
                <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={sendMessage} style={{ padding: '16px', borderTop: '1px solid #ccc', display: 'flex', backgroundColor: '#fff' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tapez /nouveau-dossier [description] ou votre question..."
                    style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '8px' }}
                    disabled={loading}
                />
                <button type="submit" disabled={loading} style={{ padding: '10px 15px', borderRadius: '4px', border: 'none', backgroundColor: loading ? '#aaa' : '#007bff', color: 'white', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Analyse...' : 'Envoyer'}
                </button>
            </form>
        </div>
    );
}