import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, SectionList,
  TouchableOpacity, StyleSheet, StatusBar,
  Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';


const INITIAL_CONTACTS = [
];

const groupByLetter = (contacts, order = 'asc') => {
  const sorted = [...contacts].sort((a, b) =>
    order === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );
  const grouped = {};
  sorted.forEach(c => {
    const letter = c.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(c);
  });
  const keys = Object.keys(grouped).sort();
  if (order === 'desc') keys.reverse();
  return keys.map(l => ({ title: l, data: grouped[l] }));
};


const THEMES = {
  light: {
    bg:           '#F4F6F8',
    card:         '#FFFFFF',
    header:       '#1A1A2E',
    headerText:   '#FFFFFF',
    subText:      '#AAB7C4',
    text:         '#1A1A2E',
    textSoft:     '#888888',
    sectionBg:    '#E8EDF2',
    sectionText:  '#555555',
    border:       '#D5DCE4',
    separator:    '#F0F0F0',
    inputBorder:  '#EEEEEE',
    emptyText:    '#AAAAAA',
    tabBar:       '#FFFFFF',
    tabBorder:    '#EEEEEE',
    activeTab:    '#E74C3C',
    deleteBg:     '#FDECEA',
    deleteText:   '#E74C3C',
    favActive:    '#F1C40F',
    favInactive:  '#CCCCCC',
    statCard:     '#FFFFFF',
    statBorder:   '#E8EDF2',
  },
  dark: {
    bg:           '#0F0F1A',
    card:         '#1E1E2E',
    header:       '#0A0A15',
    headerText:   '#FFFFFF',
    subText:      '#6C7A89',
    text:         '#EAEAEA',
    textSoft:     '#888888',
    sectionBg:    '#16162A',
    sectionText:  '#888888',
    border:       '#2A2A3E',
    separator:    '#1A1A2E',
    inputBorder:  '#2A2A3E',
    emptyText:    '#555555',
    tabBar:       '#1E1E2E',
    tabBorder:    '#2A2A3E',
    activeTab:    '#E74C3C',
    deleteBg:     '#2E1A1A',
    deleteText:   '#E74C3C',
    favActive:    '#F1C40F',
    favInactive:  '#444444',
    statCard:     '#1E1E2E',
    statBorder:   '#2A2A3E',
  },
};


const getAvatarColor = (name) => {
  const colors = ['#E74C3C','#3498DB','#2ECC71','#9B59B6','#E67E22','#1ABC9C','#E91E63','#FF5722'];
  return colors[name.charCodeAt(0) % colors.length];
};


export default function PhoneBookPro() {
  const [contacts,   setContacts]   = useState(INITIAL_CONTACTS);
  const [search,     setSearch]     = useState('');
  const [newName,    setNewName]    = useState('');
  const [newPhone,   setNewPhone]   = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [activeTab,  setActiveTab]  = useState('tous');   // tous | favoris | stats
  const [sortOrder,  setSortOrder]  = useState('asc');    // asc | desc
  const [darkMode,   setDarkMode]   = useState(false);
  const [editId,     setEditId]     = useState(null);     // id du contact en édition

  const T = THEMES[darkMode ? 'dark' : 'light'];

  // ── Contacts filtrés ──
  const filtered = useMemo(() => {
    let list = activeTab === 'favoris'
      ? contacts.filter(c => c.favorite)
      : contacts;
    if (search.trim())
      list = list.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
      );
    return list;
  }, [contacts, search, activeTab]);

  const sections = useMemo(
    () => groupByLetter(filtered, sortOrder),
    [filtered, sortOrder]
  );

  // ── Stats ──
  const stats = useMemo(() => ({
    total:    contacts.length,
    favoris:  contacts.filter(c => c.favorite).length,
    lettres:  new Set(contacts.map(c => c.name[0].toUpperCase())).size,
  }), [contacts]);

  // ── Ajouter / Modifier ──
  const handleSave = () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert('Erreur', 'Remplissez le nom et le téléphone.');
      return;
    }
    if (editId) {
      // Modification
      setContacts(prev =>
        prev.map(c =>
          c.id === editId
            ? { ...c, name: newName.trim(), phone: newPhone.trim() }
            : c
        )
      );
      setEditId(null);
    } else {
      // Ajout
      setContacts(prev => [
        ...prev,
        { id: Date.now().toString(), name: newName.trim(), phone: newPhone.trim(), favorite: false },
      ]);
    }
    setNewName('');
    setNewPhone('');
    setShowForm(false);
  };

  // ── Ouvrir formulaire en mode édition ──
  const handleEdit = (contact) => {
    setEditId(contact.id);
    setNewName(contact.name);
    setNewPhone(contact.phone);
    setShowForm(true);
  };

  // ── Supprimer ──
  const handleDelete = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // ── Toggler favori ──
  const toggleFavorite = (id) => {
    setContacts(prev =>
      prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c)
    );
  };

  // ── Fermer formulaire ──
  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setNewName('');
    setNewPhone('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.root, { backgroundColor: T.bg }]}>
        <StatusBar
          barStyle={darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={T.header}
        />

        {/* ══════════════════════════════════════
            HEADER — 10%
        ══════════════════════════════════════ */}
        <View style={[styles.header, { backgroundColor: T.header }]}>
          <View>
            <Text style={[styles.headerTitle, { color: T.headerText }]}>
              📒 PhoneBook AN
            </Text>
            <Text style={[styles.headerCount, { color: T.subText }]}>
              {contacts.length} contacts • {stats.favoris} favoris
            </Text>
          </View>

          {/* Boutons header : tri + dark mode */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            >
              <Text style={{ fontSize: 18 }}>
                {sortOrder === 'asc' ? '🔼' : '🔽'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setDarkMode(d => !d)}
            >
              <Text style={{ fontSize: 18 }}>
                {darkMode ? '☀️' : '🌙'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ══════════════════════════════════════
            CONTENT — 80%
        ══════════════════════════════════════ */}
        <View style={[styles.content, { backgroundColor: T.bg }]}>

          {/* Onglets */}
          <View style={[styles.tabBar, {
            backgroundColor: T.tabBar,
            borderBottomColor: T.tabBorder,
          }]}>
            {[
              { id: 'tous',    label: '👥 Tous'    },
              { id: 'favoris', label: '⭐ Favoris' },
              { id: 'stats',   label: '📊 Stats'   },
            ].map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  activeTab === tab.id && { borderBottomColor: T.activeTab, borderBottomWidth: 3 },
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab.id ? T.activeTab : T.textSoft },
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Onglet Stats ── */}
          {activeTab === 'stats' ? (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
              <Text style={[styles.statsTitle, { color: T.text }]}>
                📊 Statistiques
              </Text>

              {/* Cartes stats — flexbox row */}
              <View style={styles.statsRow}>
                {[
                  { label: 'Total',    value: stats.total,   icon: '👥', color: '#3498DB' },
                  { label: 'Favoris',  value: stats.favoris, icon: '⭐', color: '#F1C40F' },
                  { label: 'Lettres',  value: stats.lettres, icon: '🔤', color: '#2ECC71' },
                ].map((s, i) => (
                  <View key={i} style={[styles.statCard, {
                    backgroundColor: T.statCard,
                    borderColor: T.statBorder,
                  }]}>
                    <Text style={styles.statIcon}>{s.icon}</Text>
                    <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                    <Text style={[styles.statLabel, { color: T.textSoft }]}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Barre de progression par lettre */}
              <Text style={[styles.statsSubTitle, { color: T.text }]}>
                Répartition par lettre
              </Text>
              {groupByLetter(contacts).map(section => (
                <View key={section.title} style={styles.barRow}>
                  <Text style={[styles.barLetter, { color: T.text }]}>
                    {section.title}
                  </Text>
                  <View style={[styles.barTrack, { backgroundColor: T.statBorder }]}>
                    <View style={[styles.barFill, {
                      width: `${(section.data.length / contacts.length) * 100}%`,
                      backgroundColor: getAvatarColor(section.title),
                    }]} />
                  </View>
                  <Text style={[styles.barCount, { color: T.textSoft }]}>
                    {section.data.length}
                  </Text>
                </View>
              ))}
            </ScrollView>

          ) : (
            /* ── Onglets Tous / Favoris ── */
            <>
              {/* Barre de recherche */}
              <View style={[styles.searchBar, { backgroundColor: T.card }]}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={[styles.searchInput, { color: T.text }]}
                  placeholder="Rechercher..."
                  placeholderTextColor={T.textSoft}
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Text style={{ color: T.textSoft, fontSize: 16, paddingHorizontal: 4 }}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Formulaire ajout / modification */}
              {showForm && (
                <View style={[styles.form, { backgroundColor: T.card }]}>
                  <Text style={[styles.formTitle, { color: T.text }]}>
                    {editId ? '✏️ Modifier le contact' : '➕ Nouveau contact'}
                  </Text>

                  <View style={[styles.inputRow, { borderBottomColor: T.inputBorder }]}>
                    <Text style={styles.inputLabel}>👤</Text>
                    <TextInput
                      style={[styles.input, { color: T.text }]}
                      placeholder="Nom complet"
                      placeholderTextColor={T.textSoft}
                      value={newName}
                      onChangeText={setNewName}
                    />
                  </View>

                  <View style={[styles.inputRow, { borderBottomColor: T.inputBorder }]}>
                    <Text style={styles.inputLabel}>📞</Text>
                    <TextInput
                      style={[styles.input, { color: T.text }]}
                      placeholder="Numéro de téléphone"
                      placeholderTextColor={T.textSoft}
                      keyboardType="phone-pad"
                      value={newPhone}
                      onChangeText={setNewPhone}
                    />
                  </View>

                  <View style={styles.formButtons}>
                    <TouchableOpacity
                      style={[styles.formBtn, { backgroundColor: T.sectionBg }]}
                      onPress={closeForm}
                    >
                      <Text style={{ color: T.textSoft, fontWeight: '600' }}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.formBtn, { backgroundColor: '#1A1A2E' }]}
                      onPress={handleSave}
                    >
                      <Text style={{ color: '#fff', fontWeight: '600' }}>
                        {editId ? '✓ Modifier' : '✓ Enregistrer'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* SectionList */}
              {sections.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={{ fontSize: 48, marginBottom: 12 }}>
                    {activeTab === 'favoris' ? '⭐' : '🔍'}
                  </Text>
                  <Text style={[styles.emptyText, { color: T.emptyText }]}>
                    {activeTab === 'favoris'
                      ? 'Aucun favori pour le moment'
                      : 'Aucun contact trouvé'}
                  </Text>
                </View>
              ) : (
                <SectionList
                  sections={sections}
                  keyExtractor={item => item.id}

                  renderSectionHeader={({ section: { title } }) => (
                    <View style={[styles.sectionHeader, {
                      backgroundColor: T.sectionBg,
                      borderTopColor: T.border,
                      borderBottomColor: T.border,
                    }]}>
                      <Text style={[styles.sectionHeaderText, { color: T.sectionText }]}>
                        {title}
                      </Text>
                    </View>
                  )}

                  renderItem={({ item }) => (
                    <View style={[styles.contactRow, { backgroundColor: T.card }]}>

                      {/* Avatar */}
                      <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.name) }]}>
                        <Text style={styles.avatarText}>{item.name[0]}</Text>
                      </View>

                      {/* Infos */}
                      <View style={styles.contactInfo}>
                        <Text style={[styles.contactName, { color: T.text }]}>{item.name}</Text>
                        <Text style={[styles.contactPhone, { color: T.textSoft }]}>{item.phone}</Text>
                      </View>

                      {/* ⭐ Favori */}
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => toggleFavorite(item.id)}
                      >
                        <Text style={{ fontSize: 20, color: item.favorite ? T.favActive : T.favInactive }}>
                          ★
                        </Text>
                      </TouchableOpacity>

                      {/* ✏️ Modifier */}
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#EBF5FB' }]}
                        onPress={() => handleEdit(item)}
                      >
                        <Text style={{ fontSize: 14 }}>✏️</Text>
                      </TouchableOpacity>

                      {/* ✕ Supprimer */}
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: T.deleteBg }]}
                        onPress={() => handleDelete(item.id)}
                      >
                        <Text style={[styles.deleteBtnText, { color: T.deleteText }]}>✕</Text>
                      </TouchableOpacity>

                    </View>
                  )}

                  ItemSeparatorComponent={() => (
                    <View style={[styles.separator, { backgroundColor: T.separator }]} />
                  )}
                />
              )}
            </>
          )}
        </View>

        {/* ══════════════════════════════════════
            FOOTER — 10%
        ══════════════════════════════════════ */}
        <View style={[styles.footer, { backgroundColor: T.header }]}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: showForm ? '#7F8C8D' : '#E74C3C' }]}
            onPress={() => showForm ? closeForm() : setShowForm(true)}
          >
            <Text style={styles.addButtonText}>
              {showForm ? '✕ Fermer' : '＋ Ajouter un contact'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root:            { flex: 1 },

  // Header 10%
  header:          { height: '10%', flexDirection: 'row', justifyContent: 'space-between',
                     alignItems: 'center', paddingHorizontal: 20 },
  headerTitle:     { fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  headerCount:     { fontSize: 12, marginTop: 2 },
  headerActions:   { flexDirection: 'row', gap: 8 },
  headerBtn:       { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)',
                     justifyContent: 'center', alignItems: 'center' },

  // Content 80%
  content:         { height: '80%' },

  // Footer 10%
  footer:          { height: '10%', justifyContent: 'center', alignItems: 'center' },
  addButton:       { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
  addButtonText:   { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // Tabs
  tabBar:          { flexDirection: 'row', borderBottomWidth: 1 },
  tab:             { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText:         { fontSize: 13, fontWeight: '600' },

  // Recherche
  searchBar:       { flexDirection: 'row', alignItems: 'center', margin: 12,
                     borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, elevation: 2 },
  searchIcon:      { fontSize: 16, marginRight: 8 },
  searchInput:     { flex: 1, fontSize: 15 },

  // Formulaire
  form:            { marginHorizontal: 12, borderRadius: 12, padding: 16,
                     marginBottom: 8, elevation: 2 },
  formTitle:       { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  inputRow:        { flexDirection: 'row', alignItems: 'center',
                     borderBottomWidth: 1, marginBottom: 12 },
  inputLabel:      { fontSize: 18, marginRight: 10 },
  input:           { flex: 1, fontSize: 15, paddingVertical: 6 },
  formButtons:     { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
  formBtn:         { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },

  // SectionList
  sectionHeader:   { paddingHorizontal: 16, paddingVertical: 5,
                     borderTopWidth: 1, borderBottomWidth: 1 },
  sectionHeaderText: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },

  // Ligne contact
  contactRow:      { flexDirection: 'row', alignItems: 'center',
                     paddingHorizontal: 16, paddingVertical: 10 },
  avatar:          { width: 46, height: 46, borderRadius: 23,
                     justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText:      { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  contactInfo:     { flex: 1, flexDirection: 'column' },
  contactName:     { fontSize: 16, fontWeight: '600' },
  contactPhone:    { fontSize: 13, marginTop: 2 },

  // Boutons action
  actionBtn:       { width: 32, height: 32, borderRadius: 16,
                     justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  deleteBtnText:   { fontSize: 14, fontWeight: 'bold' },

  separator:       { height: 1, marginLeft: 76 },
  emptyState:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText:       { fontSize: 16 },

  // Stats
  statsTitle:      { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  statsSubTitle:   { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 12 },
  statsRow:        { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  statCard:        { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center',
                     borderWidth: 1, elevation: 2 },
  statIcon:        { fontSize: 24, marginBottom: 6 },
  statValue:       { fontSize: 28, fontWeight: 'bold' },
  statLabel:       { fontSize: 12, marginTop: 4 },
  barRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  barLetter:       { width: 24, fontWeight: 'bold', fontSize: 14 },
  barTrack:        { flex: 1, height: 10, borderRadius: 5, marginHorizontal: 10 },
  barFill:         { height: 10, borderRadius: 5 },
  barCount:        { width: 20, fontSize: 12, textAlign: 'right' },
});