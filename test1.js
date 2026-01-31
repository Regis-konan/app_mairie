// ========== VARIABLES GLOBALES ==========
let ligneCount = 0;
let archives = JSON.parse(localStorage.getItem('archivesMairie')) || [];
let compteurBord = parseInt(localStorage.getItem('compteurBord') || 1);
let compteurMand = parseInt(localStorage.getItem('compteurMand') || 1);

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Logiciel Mairie - Initialisation...');
    
    // Initialiser les dates
    const aujourdhui = new Date().toISOString().split('T')[0];
    document.getElementById('bord-date').value = aujourdhui;
    
    // Initialiser les numéros
    const exercice = document.getElementById('bord-exercice').value;
    document.getElementById('bord-numero').value = `BR-${exercice}-${String(compteurBord).padStart(3, '0')}`;
    document.getElementById('mand-numero').value = `MP-${exercice}-${String(compteurMand).padStart(3, '0')}`;
    
    // Navigation sidebar
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Animation sur le bouton cliqué
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const target = this.getAttribute('data-target');
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(`section-${target}`).classList.add('active');
            
            // Mettre à jour le titre
            const titles = {
                'bordereau': 'Bordereau d\'Émission des Mandats - CMU',
                'mandat': 'Mandat de Paiement - Salaire',
                'archives': 'Archives des Documents',
                'aide': 'Guide d\'Utilisation'
            };
            document.getElementById('current-section-title').textContent = titles[target];
            
            // Si on va aux archives, les recharger
            if (target === 'archives') {
                chargerArchives();
            }
        });
    });
    
    // Ajouter première ligne au bordereau
    ajouterLigneBordereau();
    
    // Charger les archives
    chargerArchives();
    
    // Notification de bienvenue
    setTimeout(() => {
        showToast('✅ Logiciel prêt à l\'emploi !', 'success');
    }, 1000);
    
    console.log('✅ Initialisation terminée');
});

// ========== FONCTIONS BORDEREAU ==========

function ajouterLigneBordereau() {
    ligneCount++;
    const tbody = document.getElementById('tableau-lignes');
    
    const tr = document.createElement('tr');
    tr.style.animation = 'fadeInUp 0.4s ease';
    tr.innerHTML = `
        <td>${ligneCount}</td>
        <td><input type="text" class="ligne-nature" value="CMU" placeholder="Nature de la dépense"></td>
        <td><input type="text" class="ligne-creancier" value="" placeholder="Nom du créancier"></td>
        <td><input type="text" class="ligne-imputation" value="6000/1" placeholder="Code budgétaire"></td>
        <td><input type="number" class="ligne-montant" value="0" min="0" step="100" placeholder="Montant"></td>
        <td style="text-align: center;">
            <button class="btn btn-danger btn-sm" onclick="supprimerLigne(this)" title="Supprimer cette ligne">
                <span style="font-size: 18px;">×</span>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
    
    // Ajouter les écouteurs d'événements
    const montantInput = tr.querySelector('.ligne-montant');
    montantInput.addEventListener('input', calculerTotalBordereau);
    montantInput.addEventListener('focus', function() {
        this.style.backgroundColor = '#f0f9ff';
    });
    montantInput.addEventListener('blur', function() {
        this.style.backgroundColor = '';
    });
    
    calculerTotalBordereau();
    
    // Effet visuel
    tr.style.backgroundColor = '#f0f9ff';
    setTimeout(() => {
        tr.style.backgroundColor = '';
    }, 500);
    
    showToast('➕ Ligne ajoutée', 'info');
}

function supprimerLigne(btn) {
    const tr = btn.closest('tr');
    tr.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        tr.remove();
        renumLignes();
        calculerTotalBordereau();
        showToast('🗑️ Ligne supprimée', 'warning');
    }, 300);
}

function renumLignes() {
    const lignes = document.querySelectorAll('#tableau-lignes tr');
    ligneCount = 0;
    lignes.forEach((tr, index) => {
        ligneCount++;
        tr.cells[0].textContent = ligneCount;
        tr.style.animationDelay = `${index * 0.05}s`;
    });
}

function calculerTotalBordereau() {
    let total = 0;
    const montantInputs = document.querySelectorAll('.ligne-montant');
    
    montantInputs.forEach(input => {
        const valeur = parseFloat(input.value);
        if (!isNaN(valeur)) {
            total += valeur;
        }
    });
    
    const totalElement = document.getElementById('total-bord');
    totalElement.textContent = total.toLocaleString('fr-FR') + ' F CFA';
    
    // Animation sur le total
    totalElement.style.transform = 'scale(1.1)';
    totalElement.style.color = '#28a745';
    setTimeout(() => {
        totalElement.style.transform = '';
        totalElement.style.color = '';
    }, 300);
    
    return total;
}

function remplirExempleCMU() {
    // Vider le tableau avec animation
    const tbody = document.getElementById('tableau-lignes');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        row.style.animation = 'fadeOut 0.3s ease';
        row.style.animationDelay = `${index * 0.1}s`;
    });
    
    setTimeout(() => {
        tbody.innerHTML = '';
        ligneCount = 0;
        
        // Données d'exemple de IMG_1144
        const exemples = [
            { nature: "CMU", creancier: "COTISATION CMU", imputation: "6000/1", montant: 10000 },
            { nature: "CMU", creancier: "COTISATION CMU", imputation: "60012/1", montant: 15500 },
            { nature: "CMU", creancier: "COTISATION CMU", imputation: "6002/1", montant: 58000 },
            { nature: "CMU", creancier: "COTISATION CMU", imputation: "6010/1", montant: 92500 },
            { nature: "CMU", creancier: "COTISATION CMU", imputation: "6031/1", montant: 115500 },
            { nature: "CMU", creancier: "COTISATION CMU", imputation: "6100/1", montant: 69000 },
            { nature: "CMU", creancier: "COTISATION CMU", imputation: "6250/1", montant: 63500 }
        ];
        
        exemples.forEach((ex, index) => {
            setTimeout(() => {
                ligneCount++;
                const tr = document.createElement('tr');
                tr.style.animation = 'fadeInUp 0.4s ease';
                tr.style.animationDelay = `${index * 0.1}s`;
                tr.innerHTML = `
                    <td>${ligneCount}</td>
                    <td><input type="text" class="ligne-nature" value="${ex.nature}"></td>
                    <td><input type="text" class="ligne-creancier" value="${ex.creancier}"></td>
                    <td><input type="text" class="ligne-imputation" value="${ex.imputation}"></td>
                    <td><input type="number" class="ligne-montant" value="${ex.montant}" min="0" step="100"></td>
                    <td style="text-align: center;">
                        <button class="btn btn-danger btn-sm" onclick="supprimerLigne(this)" title="Supprimer cette ligne">
                            <span style="font-size: 18px;">×</span>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
                
                // Ajouter écouteur d'événement
                const montantInput = tr.querySelector('.ligne-montant');
                montantInput.addEventListener('input', calculerTotalBordereau);
            }, index * 100);
        });
        
        setTimeout(() => {
            calculerTotalBordereau();
            showToast('📋 Exemple CMU chargé', 'success');
        }, exemples.length * 100 + 100);
    }, 300);
}

function enregistrerBordereau() {
    const numero = document.getElementById('bord-numero').value;
    const exercice = document.getElementById('bord-exercice').value;
    const date = document.getElementById('bord-date').value;
    const folio = document.getElementById('bord-folio').value;
    const total = calculerTotalBordereau();
    
    // Validation
    if (total === 0) {
        showToast('❌ Le total doit être supérieur à 0', 'error');
        return;
    }
    
    // Récupérer les lignes
    const lignes = [];
    const rows = document.querySelectorAll('#tableau-lignes tr');
    
    if (rows.length === 0) {
        showToast('❌ Ajoutez au moins une ligne', 'error');
        return;
    }
    
    rows.forEach(tr => {
        const nature = tr.querySelector('.ligne-nature').value.trim();
        const creancier = tr.querySelector('.ligne-creancier').value.trim();
        const imputation = tr.querySelector('.ligne-imputation').value.trim();
        const montant = parseFloat(tr.querySelector('.ligne-montant').value) || 0;
        
        if (nature && imputation && montant > 0) {
            lignes.push({ nature, creancier, imputation, montant });
        }
    });
    
    if (lignes.length === 0) {
        showToast('❌ Remplissez correctement les lignes', 'error');
        return;
    }
    
    // Créer l'objet bordereau
    const bordereau = {
        id: Date.now(),
        type: 'bordereau',
        numero,
        exercice,
        date,
        folio,
        lignes,
        total,
        dateCreation: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Sauvegarder
    archives.unshift(bordereau);
    localStorage.setItem('archivesMairie', JSON.stringify(archives));
    
    // Incrémenter compteur
    compteurBord++;
    localStorage.setItem('compteurBord', compteurBord);
    document.getElementById('bord-numero').value = `BR-${exercice}-${String(compteurBord).padStart(3, '0')}`;
    
    // Effet visuel
    document.querySelector('#section-bordereau .btn-success').style.transform = 'scale(0.95)';
    setTimeout(() => {
        document.querySelector('#section-bordereau .btn-success').style.transform = '';
    }, 200);
    
    showToast(`✅ Bordereau ${numero} enregistré (${total.toLocaleString('fr-FR')} F CFA)`, 'success');
    chargerArchives();
}

function imprimerBordereau() {
    const printWindow = window.open('', '_blank');
    const exercice = document.getElementById('bord-exercice').value;
    const numero = document.getElementById('bord-numero').value;
    const dateInput = document.getElementById('bord-date').value;
    const folio = document.getElementById('bord-folio').value;
    const total = calculerTotalBordereau();
    
    // Formater la date en français
    const dateObj = dateInput ? new Date(dateInput) : new Date();
    const dateFormatted = dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    // Générer les lignes HTML
    let lignesHTML = '';
    let lignesCount = 0;
    const rows = document.querySelectorAll('#tableau-lignes tr');
    
    rows.forEach((tr, index) => {
        const nature = tr.querySelector('.ligne-nature').value.trim() || '-';
        const creancier = tr.querySelector('.ligne-creancier').value.trim() || '-';
        const imputation = tr.querySelector('.ligne-imputation').value.trim() || '-';
        const montant = parseFloat(tr.querySelector('.ligne-montant').value) || 0;
        
        if (nature || creancier || imputation || montant > 0) {
            lignesCount++;
            lignesHTML += `
                <tr>
                    <td style="text-align: center;">${lignesCount}</td>
                    <td>${nature}</td>
                    <td>${creancier}</td>
                    <td>${imputation}</td>
                    <td style="text-align: right;">${montant.toLocaleString('fr-FR')} F CFA</td>
                </tr>
            `;
        }
    });
    
    if (lignesCount === 0) {
        alert("❌ Aucune ligne valide à imprimer");
        return;
    }
    
    const totalEnLettres = nombreEnLettres(total);
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bordereau ${numero}</title>
            <style>
                @page { margin: 20mm; }
                body { 
                    font-family: 'Times New Roman', Times, serif; 
                    font-size: 12pt; 
                    margin: 0;
                    padding: 0;
                    line-height: 1.4;
                    color: #000;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 25px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 15px;
                }
                .header h2 { 
                    font-size: 18pt; 
                    margin: 5px 0; 
                    font-weight: bold;
                }
                .header h3 { 
                    font-size: 14pt; 
                    margin: 3px 0; 
                    font-weight: bold;
                }
                .header p { 
                    margin: 2px 0; 
                    font-size: 11pt;
                }
                .document-title { 
                    text-align: center; 
                    font-size: 16pt; 
                    font-weight: bold; 
                    margin: 20px 0 10px 0;
                    text-decoration: underline;
                }
                .exercice { 
                    text-align: center; 
                    font-size: 12pt; 
                    margin-bottom: 20px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0 30px 0;
                    font-size: 11pt;
                }
                th { 
                    border: 1.5px solid #000; 
                    padding: 10px 6px; 
                    text-align: center; 
                    font-weight: bold;
                    background-color: #f0f0f0;
                }
                td { 
                    border: 1px solid #000; 
                    padding: 8px 6px; 
                    text-align: left;
                }
                .total { 
                    text-align: right; 
                    font-weight: bold; 
                    margin: 30px 0; 
                    font-size: 13pt;
                    border-top: 2px solid #000;
                    padding-top: 15px;
                }
                .signatures { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-top: 60px;
                    page-break-inside: avoid;
                }
                .signature-box { 
                    width: 45%; 
                    text-align: center;
                }
                .signature-line { 
                    border-top: 1px solid #000; 
                    padding-top: 15px; 
                    margin-bottom: 10px;
                    height: 50px;
                }
                .footer { 
                    margin-top: 40px; 
                    font-size: 10pt; 
                    color: #666;
                    text-align: center;
                    border-top: 1px solid #ccc;
                    padding-top: 10px;
                }
                .montant-lettres {
                    font-weight: bold;
                    margin-top: 10px;
                    font-style: italic;
                }
                @media print {
                    body { margin: 0; padding: 0; }
                    .no-print { display: none; }
                    .page-break { page-break-before: always; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>REPUBLIQUE DE COTE D'IVOIRE</h2>
                <h3>DISTRICT AUTONOME D'ABIDJAN</h3>
                <h3>COMMUNE D'ADJAME</h3>
                <p>CODE: 312</p>
            </div>
            
            <div class="document-title">BORDEREAU D'ÉMISSION DES MANDATS</div>
            <div class="exercice">EXERCICE ${exercice}</div>
            
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;">N°</th>
                        <th style="width: 30%;">Nature de la Dépense</th>
                        <th style="width: 25%;">Nom et adresse du créancier</th>
                        <th style="width: 15%;">IMPUTATION</th>
                        <th style="width: 15%;">SOMME Mandatée</th>
                    </tr>
                </thead>
                <tbody>
                    ${lignesHTML}
                </tbody>
            </table>
            
            <div class="total">
                <div>TOTAL DU PRÉSENT BORDEREAU: ${total.toLocaleString('fr-FR')} F CFA</div>
                <div>TOTAL GÉNÉRAL: ${total.toLocaleString('fr-FR')} F CFA</div>
                <div class="montant-lettres">Arrêté à la somme de: ${totalEnLettres}</div>
            </div>
            
            <div class="signatures">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div>Adjamé, le ${dateFormatted}</div>
                    <div style="margin-top: 20px; font-weight: bold;">L'ordonnateur</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div>DATE d'émission: ${dateFormatted}</div>
                    <div style="margin-top: 20px; font-weight: bold;">CONTROLE des prises en charges</div>
                </div>
            </div>
            
            <div class="footer">
                <p>Bordereau: ${numero} | Folio: ${folio} | Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div class="no-print" style="text-align: center; margin-top: 30px;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #0056b3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🖨️ Imprimer ce document
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                    ✕ Fermer
                </button>
            </div>
            
            <script>
                // Auto-impression après chargement
                window.onload = function() {
                    setTimeout(() => {
                        // window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Focus et impression
    setTimeout(() => {
        printWindow.focus();
        showToast('🖨️ Fenêtre d\'impression ouverte', 'info');
    }, 500);
}

function genererPDFBordereau() {
    showToast('📄 Fonction PDF bientôt disponible', 'info');
    // À implémenter avec jsPDF
}

// ========== FONCTIONS MANDAT ==========

function enregistrerMandat() {
    const numero = document.getElementById('mand-numero').value;
    const exercice = document.getElementById('mand-exercice').value;
    const titreBudget = document.getElementById('mand-titre-budget').value;
    const fonctionnelle = document.getElementById('mand-fonctionnelle').value;
    const patrimoniale = document.getElementById('mand-patrimoniale').value.trim();
    const inscription = document.getElementById('mand-inscription').value.trim();
    const bordereauRef = document.getElementById('mand-bordereau').value.trim();
    const code = document.getElementById('mand-code').value;
    const comptable = document.getElementById('mand-comptable').value.trim();
    const objet = document.getElementById('mand-objet').value;
    const beneficiaire = document.getElementById('mand-beneficiaire').value;
    const montant = parseFloat(document.getElementById('mand-montant').value) || 0;
    const virementType = document.querySelector('input[name="virement-type"]:checked').value;
    const compte = document.getElementById('mand-compte').value.trim();
    const agence = document.getElementById('mand-agence').value.trim();
    const pieces = document.getElementById('mand-pieces').value;
    
    // Validation
    if (!beneficiaire || beneficiaire.trim() === '') {
        showToast('❌ Saisissez le bénéficiaire', 'error');
        document.getElementById('mand-beneficiaire').focus();
        return;
    }
    
    if (montant <= 0) {
        showToast('❌ Saisissez un montant valide', 'error');
        document.getElementById('mand-montant').focus();
        return;
    }
    
    if (!objet || objet.trim() === '') {
        showToast('❌ Saisissez l\'objet de la dépense', 'error');
        document.getElementById('mand-objet').focus();
        return;
    }
    
    // Créer l'objet mandat
    const mandat = {
        id: Date.now(),
        type: 'mandat',
        numero,
        exercice,
        titreBudget,
        fonctionnelle,
        patrimoniale: patrimoniale || null,
        inscription: inscription || null,
        bordereauRef: bordereauRef || null,
        code,
        comptable: comptable || null,
        objet,
        beneficiaire,
        montant,
        virementType,
        compte: compte || null,
        agence: agence || null,
        pieces,
        dateCreation: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Sauvegarder
    archives.unshift(mandat);
    localStorage.setItem('archivesMairie', JSON.stringify(archives));
    
    // Incrémenter compteur
    compteurMand++;
    localStorage.setItem('compteurMand', compteurMand);
    document.getElementById('mand-numero').value = `MP-${exercice}-${String(compteurMand).padStart(3, '0')}`;
    
    // Effet visuel
    const btn = document.querySelector('#section-mandat .btn-success');
    btn.style.transform = 'scale(0.95)';
    btn.innerHTML = '<span class="loading"></span> Enregistrement...';
    setTimeout(() => {
        btn.style.transform = '';
        btn.innerHTML = '💾 ENREGISTRER LE MANDAT';
    }, 500);
    
    showToast(`✅ Mandat ${numero} enregistré (${montant.toLocaleString('fr-FR')} F CFA)`, 'success');
    chargerArchives();
}

function imprimerMandat() {
    const printWindow = window.open('', '_blank');
    
    // Récupérer les valeurs
    const exercice = document.getElementById('mand-exercice').value;
    const titreBudget = document.getElementById('mand-titre-budget').value;
    const fonctionnelle = document.getElementById('mand-fonctionnelle').value;
    const patrimoniale = document.getElementById('mand-patrimoniale').value.trim();
    const inscription = document.getElementById('mand-inscription').value.trim();
    const numero = document.getElementById('mand-numero').value;
    const bordereauRef = document.getElementById('mand-bordereau').value.trim();
    const code = document.getElementById('mand-code').value;
    const comptable = document.getElementById('mand-comptable').value.trim();
    const objet = document.getElementById('mand-objet').value;
    const beneficiaire = document.getElementById('mand-beneficiaire').value;
    const montant = parseFloat(document.getElementById('mand-montant').value) || 0;
    const virementType = document.querySelector('input[name="virement-type"]:checked').value;
    const compte = document.getElementById('mand-compte').value.trim();
    const agence = document.getElementById('mand-agence').value.trim();
    const pieces = document.getElementById('mand-pieces').value;
    
    // Validation
    if (!beneficiaire || montant <= 0) {
        showToast('❌ Remplissez les champs obligatoires', 'error');
        return;
    }
    
    // Déterminer les cases cochées
    const postalChecked = virementType === 'postal' ? '☑' : '☐';
    const bancaireChecked = virementType === 'bancaire' ? '☑' : '☐';
    const chequeChecked = virementType === 'cheque' ? '☑' : '☐';
    
    const montantEnLettres = nombreEnLettres(montant);
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Mandat ${numero}</title>
            <style>
                @page { margin: 15mm; }
                body { 
                    font-family: 'Times New Roman', Times, serif; 
                    font-size: 11pt; 
                    margin: 0;
                    padding: 0;
                    line-height: 1.3;
                    color: #000;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 20px;
                    border-bottom: 3px double #000;
                    padding-bottom: 15px;
                }
                .header h2 { 
                    font-size: 16pt; 
                    margin: 5px 0; 
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .header h3 { 
                    font-size: 14pt; 
                    margin: 5px 0; 
                    font-weight: bold;
                }
                .section { 
                    margin-bottom: 15px;
                    page-break-inside: avoid;
                }
                .field { 
                    margin-bottom: 8px;
                    display: flex;
                }
                .label { 
                    font-weight: bold; 
                    min-width: 180px;
                    flex-shrink: 0;
                }
                .value { 
                    flex: 1;
                }
                .box { 
                    border: 1.5px solid #000; 
                    padding: 12px; 
                    margin: 12px 0;
                    background: #f9f9f9;
                }
                .signature { 
                    margin-top: 40px; 
                    border-top: 1px solid #000; 
                    padding-top: 12px; 
                    width: 250px;
                    text-align: center;
                }
                .total { 
                    text-align: right; 
                    font-weight: bold; 
                    font-size: 12pt; 
                    margin: 25px 0;
                    border-top: 2px solid #000;
                    padding-top: 15px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse;
                    margin: 15px 0;
                }
                td { 
                    padding: 6px; 
                    vertical-align: top;
                }
                .border-box { 
                    border: 1px solid #000; 
                    padding: 8px;
                    margin: 5px 0;
                    background: white;
                }
                .virement-options {
                    margin-top: 10px;
                    font-size: 10.5pt;
                }
                .checkbox {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    border: 1.5px solid #000;
                    margin-right: 6px;
                    text-align: center;
                    line-height: 12px;
                    font-size: 10pt;
                }
                .tresorerie {
                    font-weight: bold;
                    margin-top: 10px;
                    text-align: center;
                    font-size: 12pt;
                }
                .creancier-header {
                    font-weight: bold;
                    font-size: 12pt;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .montant-section {
                    text-align: right;
                    font-weight: bold;
                    font-size: 14pt;
                }
                .no-print { 
                    display: none; 
                }
                @media print {
                    body { margin: 0; padding: 0; }
                    .no-print { display: none !important; }
                    .page-break { page-break-before: always; }
                }
                @media screen {
                    .no-print { display: block; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>REPUBLIQUE DE COTE D'IVOIRE</h2>
                <h2>MANDAT DE PAIEMENT</h2>
            </div>
            
            <div class="section">
                <div class="field">
                    <span class="label">EXERCICE :</span>
                    <span class="value">${exercice}</span>
                </div>
                <div class="field">
                    <span class="label">TITRE DU BUDGET :</span>
                    <span class="value">${titreBudget}</span>
                </div>
            </div>
            
            <div class="section">
                <div style="font-weight: bold; margin-bottom: 8px;">IMPUTATION</div>
                <div class="field">
                    <span class="label">FONCTIONNELLE :</span>
                    <span class="value">${fonctionnelle}</span>
                </div>
                ${patrimoniale ? `<div class="field">
                    <span class="label">PATRIMONIALE :</span>
                    <span class="value">${patrimoniale}</span>
                </div>` : ''}
            </div>
            
            <table>
                <tr>
                    <td style="width: 33%;">
                        <div>N° d'inscription au livre d'exécution des opérations budgétaires.</div>
                        ${inscription ? `<div style="margin-top: 10px; font-weight: bold;">${inscription}</div>` : 
                          '<div style="margin-top: 20px; height: 20px;"></div>'}
                    </td>
                    <td style="width: 33%;">
                        <div>Numéro d'ordre :</div>
                        <div style="margin-top: 10px; font-weight: bold; font-size: 12pt;">${numero}</div>
                    </td>
                    <td style="width: 33%;">
                        <div>Numéro du Bordereau d'émission :</div>
                        ${bordereauRef ? `<div style="margin-top: 10px;">${bordereauRef}</div>` : 
                          '<div style="margin-top: 20px; height: 20px;"></div>'}
                    </td>
                </tr>
            </table>
            
            <div class="section">
                <div class="field">
                    <span class="label">CODE :</span>
                    <span class="value">${code}</span>
                </div>
                ${comptable ? `<div class="field">
                    <span class="label">COMPTABLE PAYEUR :</span>
                    <span class="value">${comptable}</span>
                </div>` : ''}
            </div>
            
            <div class="section">
                <div>Object de la dépense :</div>
                <div class="border-box">${objet}</div>
                <div class="tresorerie">TRESORERIE PRINCIPALE D'ADJAME</div>
            </div>
            
            <div class="box">
                <div class="creancier-header">CREANCIER</div>
                <table>
                    <tr>
                        <td style="width: 70%;">
                            <div>Bénéficiaire :</div>
                            <div style="font-weight: bold; margin-top: 8px; font-size: 12pt;">${beneficiaire}</div>
                        </td>
                        <td style="width: 30%;" class="montant-section">
                            <div>Montant Brut</div>
                            <div style="margin-top: 8px;">${montant.toLocaleString('fr-FR')} F CFA</div>
                        </td>
                    </tr>
                </table>
            </div>
            
            <table>
                <tr>
                    <td style="width: 40%;">
                        <div>AU VIREMENT A :</div>
                        <div class="virement-options">
                            <div><span class="checkbox">${postalChecked}</span> Virement Postal</div>
                            <div><span class="checkbox">${bancaireChecked}</span> Virement Bancaire</div>
                            <div><span class="checkbox">${chequeChecked}</span> Chèque bancaire</div>
                        </div>
                    </td>
                    <td style="width: 60%;">
                        ${compte ? `<div>Compte Bancaire :</div>
                        <div style="margin-top: 5px; font-weight: bold;">${compte}</div>` : ''}
                        ${agence ? `<div style="margin-top: ${compte ? '15px' : '10px'};">ou Postal :</div>
                        <div style="margin-top: 5px;">${agence}</div>` : ''}
                    </td>
                </tr>
            </table>
            
            <div class="section">
                <div>Pièces Justificatives de la Dépense</div>
                <div class="border-box">${pieces}</div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                <div class="signature">
                    <div>Signature et Cachet de l'Ordonnateur</div>
                    <div style="margin-top: 10px; font-weight: bold;">SOUMAHORO FARIKOU</div>
                </div>
                <div class="signature">
                    <div>Pour acquis de la somme indiquée ci-dessus</div>
                </div>
            </div>
            
            <div class="total">
                Arrêté le présent mandat de paiement à la somme de :<br>
                <span style="font-size: 13pt;">${montantEnLettres}</span>
            </div>
            
            <div class="no-print" style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc;">
                <button onclick="window.print()" style="padding: 12px 24px; background: #0056b3; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin: 5px;">
                    🖨️ Imprimer ce document
                </button>
                <button onclick="window.close()" style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin: 5px;">
                    ✕ Fermer la fenêtre
                </button>
                <p style="margin-top: 15px; color: #666; font-size: 11pt;">
                    Document: ${numero} | Exercice: ${exercice} | Généré le ${new Date().toLocaleDateString('fr-FR')}
                </p>
            </div>
            
            <script>
                // Auto-impression après chargement
                window.onload = function() {
                    setTimeout(() => {
                        // window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Focus et impression
    setTimeout(() => {
        printWindow.focus();
        showToast('🖨️ Fenêtre d\'impression ouverte', 'info');
    }, 500);
}

function genererPDFMandat() {
    showToast('📄 Fonction PDF bientôt disponible', 'info');
    // À implémenter avec jsPDF
}

// ========== FONCTIONS ARCHIVES ==========

function chargerArchives() {
    const container = document.getElementById('liste-archives');
    
    if (archives.length === 0) {
        container.innerHTML = `
            <div class="empty-archive">
                <div style="font-size: 48px; margin-bottom: 20px; color: #cbd5e0;">📁</div>
                <p style="font-size: 18px; color: #718096; margin-bottom: 10px;">Aucun document enregistré</p>
                <p style="color: #a0aec0;">Créez votre premier bordereau ou mandat</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    archives.forEach((doc, index) => {
        const date = doc.dateCreation || new Date().toLocaleDateString('fr-FR');
        
        html += `
            <div class="doc-item" style="animation-delay: ${index * 0.05}s">
                <div class="doc-info">
                    <span class="doc-type ${doc.type === 'bordereau' ? 'type-bordereau' : 'type-mandat'}">
                        ${doc.type === 'bordereau' ? 'BORDEREAU' : 'MANDAT'}
                    </span>
                    <div class="doc-title">${doc.numero}</div>
                    <div class="doc-details">
                        ${doc.type === 'bordereau' ? 
                            `<span>Exercice ${doc.exercice}</span>
                             <span>${doc.lignes?.length || 0} lignes</span>
                             <span>${doc.date || ''}</span>` 
                          : 
                            `<span>${doc.beneficiaire || ''}</span>
                             <span>Exercice ${doc.exercice}</span>`
                        }
                    </div>
                    <div class="doc-details">
                        <span style="font-weight: bold; color: #0056b3;">
                            ${doc.type === 'bordereau' ? 
                                `Total: ${parseFloat(doc.total || 0).toLocaleString('fr-FR')} F CFA` 
                              : 
                                `Montant: ${parseFloat(doc.montant || 0).toLocaleString('fr-FR')} F CFA`
                            }
                        </span>
                    </div>
                    <div class="doc-date">Créé le: ${date}</div>
                </div>
                <div class="doc-actions">
                    <button class="btn btn-secondary" onclick="voirDocument(${doc.id})" title="Voir les détails">
                        👁️ Détails
                    </button>
                    <button class="btn btn-primary" onclick="imprimerArchive(${doc.id})" title="Ré-imprimer">
                        🖨️ Imprimer
                    </button>
                    <button class="btn btn-danger" onclick="supprimerDocument(${doc.id})" title="Supprimer">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function filtrerArchives() {
    const recherche = document.getElementById('recherche-archives').value.toLowerCase();
    const type = document.getElementById('filtre-type').value;
    const container = document.getElementById('liste-archives');
    
    if (archives.length === 0) {
        container.innerHTML = `<div class="empty-archive">Aucun document</div>`;
        return;
    }
    
    let html = '';
    let count = 0;
    
    archives.forEach((doc, index) => {
        // Filtre par type
        if (type !== 'tous' && doc.type !== type) return;
        
        // Filtre par recherche
        const matchNumero = doc.numero?.toLowerCase().includes(recherche);
        const matchBeneficiaire = doc.beneficiaire?.toLowerCase().includes(recherche);
        const matchObjet = doc.objet?.toLowerCase().includes(recherche);
        const matchCode = doc.code?.toString().includes(recherche);
        
        if (!matchNumero && !matchBeneficiaire && !matchObjet && !matchCode && recherche !== '') return;
        
        count++;
        const date = doc.dateCreation || new Date().toLocaleDateString('fr-FR');
        
        html += `
            <div class="doc-item" style="animation-delay: ${index * 0.05}s">
                <div class="doc-info">
                    <span class="doc-type ${doc.type === 'bordereau' ? 'type-bordereau' : 'type-mandat'}">
                        ${doc.type === 'bordereau' ? 'BORDEREAU' : 'MANDAT'}
                    </span>
                    <div class="doc-title">${doc.numero}</div>
                    <div class="doc-details">
                        ${doc.type === 'bordereau' ? 
                            `<span>Exercice ${doc.exercice}</span>
                             <span>${doc.lignes?.length || 0} lignes</span>` 
                          : 
                            `<span>${doc.beneficiaire || ''}</span>`
                        }
                    </div>
                    <div class="doc-details">
                        <span style="font-weight: bold; color: #0056b3;">
                            ${doc.type === 'bordereau' ? 
                                `Total: ${parseFloat(doc.total || 0).toLocaleString('fr-FR')} F CFA` 
                              : 
                                `Montant: ${parseFloat(doc.montant || 0).toLocaleString('fr-FR')} F CFA`
                            }
                        </span>
                    </div>
                </div>
                <div class="doc-actions">
                    <button class="btn btn-secondary" onclick="voirDocument(${doc.id})">👁️</button>
                    <button class="btn btn-primary" onclick="imprimerArchive(${doc.id})">🖨️</button>
                    <button class="btn btn-danger" onclick="supprimerDocument(${doc.id})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    if (count === 0) {
        container.innerHTML = `
            <div class="empty-archive">
                <div style="font-size: 36px; margin-bottom: 15px; color: #cbd5e0;">🔍</div>
                <p style="color: #718096;">Aucun résultat trouvé</p>
                <p style="color: #a0aec0; font-size: 14px;">Essayez avec d'autres critères</p>
            </div>
        `;
    } else {
        container.innerHTML = html;
    }
}

function voirDocument(id) {
    const doc = archives.find(d => d.id === id);
    
    if (!doc) {
        showToast('❌ Document introuvable', 'error');
        return;
    }
    
    let details = `=== DOCUMENT ${doc.numero.toUpperCase()} ===\n\n`;
    details += `📄 Type: ${doc.type === 'bordereau' ? 'BORDEREAU CMU' : 'MANDAT DE PAIEMENT'}\n`;
    details += `📅 Date: ${doc.date || doc.dateCreation}\n`;
    details += `🎯 Exercice: ${doc.exercice}\n`;
    
    if (doc.type === 'bordereau') {
        details += `💰 Total: ${parseFloat(doc.total || 0).toLocaleString('fr-FR')} F CFA\n`;
        details += `📝 Lignes: ${doc.lignes?.length || 0}\n\n`;
        details += `📋 DÉTAIL DES LIGNES:\n`;
        doc.lignes?.forEach((ligne, i) => {
            details += `${i+1}. ${ligne.nature} - ${ligne.imputation}: ${ligne.montant.toLocaleString('fr-FR')} F CFA\n`;
        });
    } else {
        details += `👤 Bénéficiaire: ${doc.beneficiaire}\n`;
        details += `💰 Montant: ${parseFloat(doc.montant || 0).toLocaleString('fr-FR')} F CFA\n`;
        details += `📋 Objet: ${doc.objet}\n`;
        details += `🏦 Mode paiement: ${doc.virementType}\n`;
        if (doc.compte) details += `💳 Compte: ${doc.compte}\n`;
        if (doc.comptable) details += `👔 Comptable: ${doc.comptable}\n`;
    }
    
    alert(details);
}

function imprimerArchive(id) {
    const doc = archives.find(d => d.id === id);
    
    if (!doc) {
        showToast('❌ Document introuvable', 'error');
        return;
    }
    
    if (doc.type === 'bordereau') {
        // Pré-remplir le formulaire bordereau
        document.getElementById('bord-exercice').value = doc.exercice;
        document.getElementById('bord-numero').value = doc.numero;
        document.getElementById('bord-date').value = doc.date || '';
        document.getElementById('bord-folio').value = doc.folio || '';
        
        // Vider et remplir les lignes
        const tbody = document.getElementById('tableau-lignes');
        tbody.innerHTML = '';
        ligneCount = 0;
        
        doc.lignes?.forEach((ligne, index) => {
            setTimeout(() => {
                ligneCount++;
                const tr = document.createElement('tr');
                tr.style.animation = 'fadeInUp 0.4s ease';
                tr.style.animationDelay = `${index * 0.1}s`;
                tr.innerHTML = `
                    <td>${ligneCount}</td>
                    <td><input type="text" class="ligne-nature" value="${ligne.nature}"></td>
                    <td><input type="text" class="ligne-creancier" value="${ligne.creancier || ''}"></td>
                    <td><input type="text" class="ligne-imputation" value="${ligne.imputation}"></td>
                    <td><input type="number" class="ligne-montant" value="${ligne.montant}" min="0" step="100"></td>
                    <td style="text-align: center;">
                        <button class="btn btn-danger btn-sm" onclick="supprimerLigne(this)">
                            <span style="font-size: 18px;">×</span>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            }, index * 100);
        });
        
        setTimeout(() => {
            calculerTotalBordereau();
            // Aller à la section bordereau
            document.querySelector('.sidebar-btn[data-target="bordereau"]').click();
            showToast('📄 Bordereau chargé depuis archives', 'success');
            setTimeout(() => imprimerBordereau(), 800);
        }, doc.lignes?.length * 100 + 300);
        
    } else {
        // Pré-remplir le formulaire mandat
        document.getElementById('mand-exercice').value = doc.exercice;
        document.getElementById('mand-numero').value = doc.numero;
        document.getElementById('mand-titre-budget').value = doc.titreBudget || '1';
        document.getElementById('mand-fonctionnelle').value = doc.fonctionnelle;
        document.getElementById('mand-patrimoniale').value = doc.patrimoniale || '';
        document.getElementById('mand-inscription').value = doc.inscription || '';
        document.getElementById('mand-bordereau').value = doc.bordereauRef || '';
        document.getElementById('mand-code').value = doc.code;
        document.getElementById('mand-comptable').value = doc.comptable || '';
        document.getElementById('mand-objet').value = doc.objet;
        document.getElementById('mand-beneficiaire').value = doc.beneficiaire;
        document.getElementById('mand-montant').value = doc.montant;
        document.getElementById('mand-compte').value = doc.compte || '';
        document.getElementById('mand-agence').value = doc.agence || '';
        document.getElementById('mand-pieces').value = doc.pieces || '';
        
        // Sélectionner le bon type de virement
        if (doc.virementType) {
            document.querySelector(`input[name="virement-type"][value="${doc.virementType}"]`).checked = true;
        }
        
        // Aller à la section mandat
        document.querySelector('.sidebar-btn[data-target="mandat"]').click();
        showToast('💰 Mandat chargé depuis archives', 'success');
        setTimeout(() => imprimerMandat(), 800);
    }
}

function supprimerDocument(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?\nCette action est irréversible.")) return;
    
    const doc = archives.find(d => d.id === id);
    archives = archives.filter(doc => doc.id !== id);
    localStorage.setItem('archivesMairie', JSON.stringify(archives));
    chargerArchives();
    showToast(`🗑️ Document ${doc?.numero || ''} supprimé`, 'warning');
}

function exporterTout() {
    if (archives.length === 0) {
        showToast('❌ Aucun document à exporter', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(archives, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const date = new Date().toISOString().split('T')[0];
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `archives-mairie-adjame-${date}.json`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`📤 ${archives.length} documents exportés (archives-mairie-adjame-${date}.json)`, 'success');
}

// ========== FONCTIONS UTILITAIRES ==========

function nombreEnLettres(nombre) {
    if (typeof nombre !== 'number') {
        nombre = parseFloat(nombre);
    }
    
    if (isNaN(nombre)) {
        return "zéro Francs CFA";
    }
    
    if (nombre === 0) {
        return "zéro Francs CFA";
    }
    
    // Convertir en entier
    nombre = Math.floor(nombre);
    
    if (nombre >= 1000000) {
        return nombre.toLocaleString('fr-FR') + " Francs CFA";
    }
    
    const unite = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const dizaine = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
    const special = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
    
    let resultat = '';
    
    // MILLIERS
    const milliers = Math.floor(nombre / 1000);
    if (milliers > 0) {
        if (milliers === 1) {
            resultat += 'mille ';
        } else {
            resultat += convertirCentaine(milliers) + ' mille ';
        }
        nombre = nombre % 1000;
    }
    
    // CENTAINES
    const centaines = Math.floor(nombre / 100);
    if (centaines > 0) {
        if (centaines === 1) {
            resultat += 'cent ';
        } else {
            resultat += unite[centaines] + ' cent ';
            if (centaines > 1 && (nombre % 100 === 0)) {
                resultat += 's ';
            }
        }
        nombre = nombre % 100;
    }
    
    // DIZAINES ET UNITÉS
    if (nombre > 0) {
        if (milliers > 0 || centaines > 0) {
            resultat += ' ';
        }
        
        if (nombre < 10) {
            resultat += unite[nombre];
        } else if (nombre < 17) {
            resultat += special[nombre - 10];
        } else {
            const d = Math.floor(nombre / 10);
            const u = nombre % 10;
            
            if (d === 7 || d === 9) {
                // Soixante-dix, quatre-vingt-dix
                resultat += dizaine[d];
                if (u > 0) {
                    resultat += '-' + unite[u];
                }
            } else {
                resultat += dizaine[d];
                if (u > 0) {
                    if (d === 8 && u === 0) {
                        resultat += 's';
                    } else if (u === 1 && d !== 8 && d !== 0) {
                        resultat += ' et ' + unite[u];
                    } else {
                        resultat += '-' + unite[u];
                    }
                } else if (d === 8) {
                    resultat += 's';
                }
            }
        }
    }
    
    // Supprimer les espaces en trop
    resultat = resultat.trim().replace(/\s+/g, ' ');
    
    // Capitaliser la première lettre
    resultat = resultat.charAt(0).toUpperCase() + resultat.slice(1);
    
    return resultat + " Francs CFA";
}

function convertirCentaine(n) {
    if (n === 0) return '';
    if (n < 10) {
        const unite = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
        return unite[n];
    }
    if (n < 100) {
        return nombreEnLettresSimple(n);
    }
    return nombreEnLettres(n);
}

function nombreEnLettresSimple(n) {
    if (n === 0) return '';
    
    const unite = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const dizaine = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
    const special = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
    
    let result = '';
    
    if (n < 10) {
        result = unite[n];
    } else if (n < 17) {
        result = special[n - 10];
    } else {
        const d = Math.floor(n / 10);
        const u = n % 10;
        
        result = dizaine[d];
        if (u > 0) {
            if (d === 7 || d === 9) {
                result += '-' + unite[u];
            } else if (d === 8 && u === 0) {
                result += 's';
            } else if (u === 1 && d !== 8 && d !== 9) {
                result += ' et ' + unite[u];
            } else {
                result += '-' + unite[u];
            }
        } else if (d === 8) {
            result += 's';
        }
    }
    
    return result;
}

// ========== FONCTIONS DE GESTION ==========

function reinitialiserNumerotation() {
    if (confirm("Voulez-vous réinitialiser la numérotation à 001 ?\n\n⚠️ Note: Les documents existants garderont leurs numéros actuels.\nSeuls les nouveaux documents auront la nouvelle numérotation.")) {
        // Réinitialiser les compteurs
        compteurBord = 1;
        compteurMand = 1;
        
        // Sauvegarder
        localStorage.setItem('compteurBord', compteurBord);
        localStorage.setItem('compteurMand', compteurMand);
        
        // Mettre à jour l'affichage
        const exercice = document.getElementById('bord-exercice').value;
        document.getElementById('bord-numero').value = `BR-${exercice}-001`;
        document.getElementById('mand-numero').value = `MP-${exercice}-001`;
        
        showToast('🔄 Numérotation réinitialisée à 001', 'success');
    }
}

function resetApplication() {
    if (confirm("⚠️ ATTENTION : Voulez-vous réinitialiser TOUTE l'application ?\n\nToutes les données seront effacées :\n• Tous les bordereaux\n• Tous les mandats\n• Toutes les archives\n• La numérotation\n\nCette action est irréversible !")) {
        // Effacer tout
        localStorage.clear();
        
        // Réinitialiser les variables
        archives = [];
        compteurBord = 1;
        compteurMand = 1;
        ligneCount = 0;
        
        // Réinitialiser l'interface
        document.getElementById('tableau-lignes').innerHTML = '';
        ajouterLigneBordereau();
        document.getElementById('bord-numero').value = 'BR-2025-001';
        document.getElementById('mand-numero').value = 'MP-2025-001';
        document.getElementById('liste-archives').innerHTML = '';
        
        // Réinitialiser les formulaires
        document.getElementById('mand-beneficiaire').value = 'PERSONNEL DE L\'ADMINISTRATION GENERALE';
        document.getElementById('mand-montant').value = '222222';
        document.getElementById('mand-objet').value = 'SALAIRE ACQUIS PAR LE PERSONNEL EN SERVICE DU MOIS DE NOVEMBRE 2025';
        
        showToast('🧹 Application complètement réinitialisée', 'warning');
        setTimeout(() => {
            showToast('✅ Prêt pour une nouvelle utilisation', 'success');
        }, 1000);
    }
}

function showToast(message, type = 'info') {
    // Supprimer les toasts existants
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    // Créer le toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    
    // Styles
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    toast.style.zIndex = '10000';
    toast.style.fontWeight = '500';
    toast.style.fontSize = '14px';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.animation = 'slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards';
    
    // Couleur selon le type
    switch(type) {
        case 'success':
            toast.style.background = 'linear-gradient(135deg, #28a745, #218838)';
            toast.style.color = 'white';
            toast.innerHTML = '✅ ' + toast.innerHTML;
            break;
        case 'error':
            toast.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
            toast.style.color = 'white';
            toast.innerHTML = '❌ ' + toast.innerHTML;
            break;
        case 'warning':
            toast.style.background = 'linear-gradient(135deg, #ffc107, #e0a800)';
            toast.style.color = '#000';
            toast.innerHTML = '⚠️ ' + toast.innerHTML;
            break;
        case 'info':
            toast.style.background = 'linear-gradient(135deg, #17a2b8, #138496)';
            toast.style.color = 'white';
            toast.innerHTML = 'ℹ️ ' + toast.innerHTML;
            break;
    }
    
    document.body.appendChild(toast);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// ========== AJOUTER BOUTON RÉINITIALISATION ==========
// Ajouter le bouton dans le HTML via JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter bouton réinitialisation dans section bordereau
    const mainActions = document.querySelector('#section-bordereau .main-actions');
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-warning';
    resetBtn.innerHTML = '🔄 Réinitialiser numérotation';
    resetBtn.onclick = reinitialiserNumerotation;
    resetBtn.title = 'Remettre la numérotation à 001';
    mainActions.appendChild(resetBtn);
    
    // Ajouter bouton reset complet dans section archives
    const filters = document.querySelector('#section-archives .filters');
    const resetAllBtn = document.createElement('button');
    resetAllBtn.className = 'btn btn-danger';
    resetAllBtn.innerHTML = '🗑️ Tout réinitialiser';
    resetAllBtn.onclick = resetApplication;
    resetAllBtn.title = 'Effacer toutes les données (attention!)';
    filters.appendChild(resetAllBtn);
});

// ========== STYLES POUR ANIMATIONS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #0056b3;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);