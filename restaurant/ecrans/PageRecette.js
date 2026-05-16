import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Alert, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { useTheme } from '../logique/design/ThemeContext.js';
import { supabase } from '../logique/appels_api/supabase';

// --- COMPOSANT : HERO RECETTE ---
const RecipeHero = ({ recipe, isMobile, selectedCuisine, toggleFavorite, isFavorite }) => {
  const { theme } = useTheme();
  return (
  <View style={[styles.heroFrame, { aspectRatio: isMobile ? 4 / 3 : 21 / 9 }]}>
    <Image source={{ uri: recipe.url }} style={styles.heroImage} resizeMode="cover" />
    <View style={styles.heroShadow} />
    <TouchableOpacity style={[styles.floatingAction, { backgroundColor: theme.primary, borderColor: theme.secondary }]} onPress={() => toggleFavorite({ idMeal: recipe.idMeal, strMeal: recipe.name, strMealThumb: recipe.url, area: selectedCuisine })}>
      <Ionicons name={isFavorite(recipe.idMeal) ? 'bookmark' : 'bookmark-outline'} size={24} color={theme.secondary} />
    </TouchableOpacity>
  </View>
  );
};

// --- COMPOSANT : RUBAN INFOS (Temps, Personnes) ---
const RecipeRibbon = () => {
  const { theme } = useTheme();
  return (
  <View style={styles.ribbon}>
    <View style={styles.ribbonItem}><Ionicons name="time-outline" size={14} color={theme.secondary} /><Text style={[styles.ribbonText, { color: theme.textMuted }]}>45 MIN</Text></View>
    <View style={[styles.ribbonDot, { backgroundColor: theme.border }]} />
    <View style={styles.ribbonItem}><Ionicons name="people-outline" size={14} color={theme.secondary} /><Text style={[styles.ribbonText, { color: theme.textMuted }]}>4 PERSONNES</Text></View>
    <View style={[styles.ribbonDot, { backgroundColor: theme.border }]} />
    <View style={styles.ribbonItem}><Ionicons name="wine-outline" size={14} color={theme.secondary} /><Text style={[styles.ribbonText, { color: theme.textMuted }]}>SELECTION</Text></View>
  </View>
  );
};

// --- COMPOSANT : SECTION INGRÉDIENTS ---
const IngredientsSection = ({ ingredients, isMobile }) => {
  const { theme } = useTheme();
  return (
  <View style={[styles.section, !isMobile && styles.desktopCol]}>
    <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Composition</Text>
    <View style={styles.ingredientsList}>
      {ingredients.map((ingredient) => (
        <View key={ingredient} style={styles.ingredientRow}><View style={[styles.ingDot, { backgroundColor: theme.secondary }]} /><Text style={[styles.ingText, { color: theme.textSecondary }]}>{ingredient}</Text></View>
      ))}
    </View>
  </View>
  );
};

// --- COMPOSANT : SECTION INSTRUCTIONS ---
const InstructionsSection = ({ instructions, isMobile }) => {
  const { theme } = useTheme();
  return (
  <View style={[styles.section, !isMobile && styles.desktopCol, !isMobile && { paddingLeft: 60 }]}>
    <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Elaboration</Text>
    {instructions.map((step, index) => (
      <View key={`${step.slice(0, 20)}-${index}`} style={styles.stepBlock}>
        <View style={styles.stepHeader}><Text style={[styles.stepIndex, { color: theme.secondary }]}>{(index + 1).toString().padStart(2, '0')}</Text><View style={[styles.stepLine, { backgroundColor: theme.border }]} /></View>
        <Text style={[styles.stepContent, { color: theme.textSecondary }]}>{step}</Text>
      </View>
    ))}
  </View>
  );
};

// --- COMPOSANT : GALERIE COMMUNAUTAIRE ---
const CommunityGallery = ({ photos, loading, userId, onDelete }) => {
  const { theme } = useTheme();
  return (
  <View style={styles.socialSection}>
    <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Réalisations de la Communauté</Text>
    {loading ? (
      <ActivityIndicator color={theme.secondary} />
    ) : photos.length === 0 ? (
      <Text style={[styles.noPhotoText, { color: theme.textMuted }]}>Soyez le premier à partager votre réalisation !</Text>
    ) : (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
        {photos.map((item) => (
          <View key={item.id} style={[styles.galleryCard, { backgroundColor: theme.cardBg }]}>
            <Image source={{ uri: item.photo_url }} style={styles.galleryImage} />
            {userId === item.user_id && (
              <TouchableOpacity style={styles.deletePhotoBtn} onPress={() => onDelete(item)}>
                <Ionicons name="trash" size={16} color="#FF4444" />
              </TouchableOpacity>
            )}
            <View style={styles.galleryUserRow}>
              <Image source={{ uri: item.user_avatar || 'https://via.placeholder.com/30' }} style={styles.galleryAvatar} />
              <Text style={[styles.galleryUserName, { color: theme.textSecondary }]}>{item.user_name || 'Gourmet Anonymous'}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    )}
  </View>
  );
};

// --- COMPOSANT PRINCIPAL ---
const PageRecette = ({ recipe, isMobile, toggleFavorite, isFavorite, selectedCuisine, user }) => {
  const { theme } = useTheme();
  const contentFade = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(30)).current;
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 1000, useNativeDriver: false }),
      Animated.spring(slideIn, { toValue: 0, friction: 8, useNativeDriver: false })
    ]).start();
    fetchPhotos();
  }, [recipe.idMeal]);

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from('recipe_photos')
      .select('*')
      .eq('meal_id', recipe.idMeal)
      .order('created_at', { ascending: false });
    
    if (!error) setPhotos(data || []);
    setLoadingPhotos(false);
  };

  const deletePhoto = async (photo) => {
    const performDelete = async () => {
      try {
        console.log("Tentative de suppression de:", photo.photo_url);
        
        // 1. Extraire le chemin relatif (user_id/filename)
        // L'URL est : .../public/recipe-images/USER_ID/FILENAME
        const parts = photo.photo_url.split('/recipe-images/');
        if (parts.length < 2) throw new Error("URL de photo invalide");
        const filePath = parts[1];

        console.log("Chemin identifié pour suppression:", filePath);

        // 2. Supprimer du storage
        const { error: storageError } = await supabase.storage
          .from('recipe-images')
          .remove([filePath]);

        if (storageError) throw storageError;

        // 3. Supprimer de la base de données
        const { error: dbError } = await supabase
          .from('recipe_photos')
          .delete()
          .eq('id', photo.id);

        if (dbError) throw dbError;

        Alert.alert("Succès", "Photo supprimée !");
        fetchPhotos();
      } catch (err) {
        console.error("ERREUR SUPPRESSION:", err);
        Alert.alert("Erreur", "Impossible de supprimer : " + err.message);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Voulez-vous vraiment supprimer cette photo ?")) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Supprimer ?",
        "Cette action est définitive.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Supprimer", style: "destructive", onPress: performDelete }
        ]
      );
    }
  };

  const handleCamera = async () => {
    if (!user) {
      Alert.alert("Connexion requise", "Connectez-vous avec Google pour partager votre réalisation !");
      return;
    }

    console.log("Lancement du sélecteur...");

    // Sur WEB : On ouvre directement la galerie (plus fiable)
    if (Platform.OS === 'web') {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled) uploadPhoto(result.assets[0].uri);
      return;
    }

    // Sur MOBILE : On garde le choix
    Alert.alert(
      "Partager une photo",
      "Comment souhaitez-vous ajouter votre photo ?",
      [
        {
          text: "Prendre une photo",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') return Alert.alert("Erreur", "Accès caméra refusé");
            let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
            if (!result.canceled) uploadPhoto(result.assets[0].uri);
          }
        },
        {
          text: "Choisir une photo",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
            if (!result.canceled) uploadPhoto(result.assets[0].uri);
          }
        },
        { text: "Annuler", style: "cancel" }
      ]
    );
  };

  const uploadPhoto = async (uri) => {
    if (!user) return;
    setUploading(true);
    try {
      console.log("--- DÉBUT UPLOAD ---");
      console.log("URI source:", uri);
      
      // 1. Lecture du fichier (Compatible Web & Mobile)
      let fileBody;
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        fileBody = await response.blob();
      } else {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        fileBody = decode(base64);
      }
      
      // 2. Création du fichier pour Supabase
      const fileName = `${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      console.log("Tentative d'envoi vers Storage bucket 'recipe-images'...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, fileBody, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        console.error("Erreur Storage:", uploadError);
        throw new Error(`Erreur de stockage: ${uploadError.message}`);
      }

      // 3. Récupération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      console.log("URL générée:", publicUrl);

      // 4. Insertion en base de données
      const { error: dbError } = await supabase
        .from('recipe_photos')
        .insert({
          meal_id: String(recipe.idMeal),
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email,
          user_avatar: user.user_metadata?.avatar_url,
          photo_url: publicUrl
        });

      if (dbError) {
        console.error("Erreur Base de données:", dbError);
        throw new Error(`Erreur DB: ${dbError.message}`);
      }

      console.log("--- UPLOAD RÉUSSI ---");
      Alert.alert("Succès", "Votre photo a été partagée !");
      fetchPhotos(); // Rechargement de la galerie
    } catch (err) {
      console.error("ERREUR GLOBALE UPLOAD:", err);
      Alert.alert("Erreur", err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: contentFade, transform: [{ translateY: slideIn }] }]}>
      <RecipeHero recipe={recipe} isMobile={isMobile} selectedCuisine={selectedCuisine} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
      <RecipeRibbon />
      <Text style={[styles.title, { color: theme.text }]}>{recipe.name}</Text>
      <View style={[styles.titleDivider, { backgroundColor: theme.secondary }]} />

      <TouchableOpacity 
        style={[styles.cameraButton, { backgroundColor: theme.secondary }, uploading && { opacity: 0.5 }]} 
        onPress={handleCamera}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color={theme.isDark ? theme.primary : '#FFF'} />
        ) : (
          <>
            <Ionicons name="camera" size={20} color={theme.isDark ? theme.primary : '#FFF'} />
            <Text style={[styles.cameraButtonText, { color: theme.isDark ? theme.primary : '#FFF' }]}>PARTAGER MA RÉALISATION</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={[styles.contentLayout, !isMobile && styles.desktopRow]}>
        <IngredientsSection ingredients={recipe.ingredients} isMobile={isMobile} />
        <InstructionsSection instructions={recipe.instructions} isMobile={isMobile} />
      </View>

      {/* GALERIE SOCIALE */}
      <CommunityGallery 
        photos={photos} 
        loading={loadingPhotos} 
        userId={user?.id} 
        onDelete={deletePhoto} 
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  heroFrame: { width: '100%', overflow: 'hidden', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroShadow: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  floatingAction: { position: 'absolute', bottom: -25, right: 32, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, elevation: 8 },
  ribbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, paddingVertical: 60 },
  ribbonItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ribbonText: { fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  ribbonDot: { width: 3, height: 3, borderRadius: 1.5 },
  title: { fontSize: 42, fontWeight: '300', textAlign: 'center', paddingHorizontal: 24, fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif', letterSpacing: 2, marginBottom: 20 },
  titleDivider: { width: 40, height: 1, alignSelf: 'center', marginBottom: 60 },
  contentLayout: { paddingHorizontal: 32 },
  desktopRow: { flexDirection: 'row' },
  desktopCol: { flex: 1 },
  section: { marginBottom: 60 },
  sectionTitle: { fontSize: 18, fontWeight: '300', letterSpacing: 4, marginBottom: 32, textTransform: 'uppercase' },
  ingredientsList: { gap: 16 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ingDot: { width: 6, height: 1 },
  ingText: { fontSize: 14, fontWeight: '400', lineHeight: 22 },
  stepBlock: { marginBottom: 40 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  stepIndex: { fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  stepLine: { flex: 1, height: 0.5 },
  stepContent: { lineHeight: 28, fontSize: 15, fontWeight: '400' },
  cameraButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignSelf: 'center', marginBottom: 40, gap: 10 },
  cameraButtonText: { fontWeight: 'bold', letterSpacing: 1 },
  socialSection: { marginTop: 40, paddingHorizontal: 32 },
  galleryScroll: { gap: 16, paddingBottom: 20 },
  galleryCard: { width: 150, borderRadius: 12, overflow: 'hidden' },
  galleryImage: { width: '100%', height: 150, borderRadius: 8 },
  galleryUserRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10 },
  galleryAvatar: { width: 24, height: 24, borderRadius: 12 },
  galleryUserName: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '600' },
  noPhotoText: { color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', textAlign: 'center' },
  deletePhotoBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  }
});

export default PageRecette;

