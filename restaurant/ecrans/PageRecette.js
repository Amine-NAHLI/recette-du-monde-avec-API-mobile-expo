import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, TouchableOpacity, View, Alert, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { COLORS } from '../logique/design/couleurs.js';
import { supabase } from '../logique/appels_api/supabase';

// --- COMPOSANT : HERO RECETTE ---
const RecipeHero = ({ recipe, isMobile, selectedCuisine, toggleFavorite, isFavorite }) => (
  <View style={[styles.heroFrame, { aspectRatio: isMobile ? 4 / 3 : 21 / 9 }]}>
    <Image source={{ uri: recipe.url }} style={styles.heroImage} resizeMode="cover" />
    <View style={styles.heroShadow} />
    <TouchableOpacity style={styles.floatingAction} onPress={() => toggleFavorite({ idMeal: recipe.idMeal, strMeal: recipe.name, strMealThumb: recipe.url, area: selectedCuisine })}>
      <Ionicons name={isFavorite(recipe.idMeal) ? 'bookmark' : 'bookmark-outline'} size={24} color={COLORS.secondary} />
    </TouchableOpacity>
  </View>
);

// --- COMPOSANT : RUBAN INFOS (Temps, Personnes) ---
const RecipeRibbon = () => (
  <View style={styles.ribbon}>
    <View style={styles.ribbonItem}><Ionicons name="time-outline" size={14} color={COLORS.secondary} /><Text style={styles.ribbonText}>45 MIN</Text></View>
    <View style={styles.ribbonDot} />
    <View style={styles.ribbonItem}><Ionicons name="people-outline" size={14} color={COLORS.secondary} /><Text style={styles.ribbonText}>4 PERSONNES</Text></View>
    <View style={styles.ribbonDot} />
    <View style={styles.ribbonItem}><Ionicons name="wine-outline" size={14} color={COLORS.secondary} /><Text style={styles.ribbonText}>SELECTION</Text></View>
  </View>
);

// --- COMPOSANT : SECTION INGRÉDIENTS ---
const IngredientsSection = ({ ingredients, isMobile }) => (
  <View style={[styles.section, !isMobile && styles.desktopCol]}>
    <Text style={styles.sectionTitle}>Composition</Text>
    <View style={styles.ingredientsList}>
      {ingredients.map((ingredient) => (
        <View key={ingredient} style={styles.ingredientRow}><View style={styles.ingDot} /><Text style={styles.ingText}>{ingredient}</Text></View>
      ))}
    </View>
  </View>
);

// --- COMPOSANT : SECTION INSTRUCTIONS ---
const InstructionsSection = ({ instructions, isMobile }) => (
  <View style={[styles.section, !isMobile && styles.desktopCol, !isMobile && { paddingLeft: 60 }]}>
    <Text style={styles.sectionTitle}>Elaboration</Text>
    {instructions.map((step, index) => (
      <View key={`${step.slice(0, 20)}-${index}`} style={styles.stepBlock}>
        <View style={styles.stepHeader}><Text style={styles.stepIndex}>{(index + 1).toString().padStart(2, '0')}</Text><View style={styles.stepLine} /></View>
        <Text style={styles.stepContent}>{step}</Text>
      </View>
    ))}
  </View>
);

// --- COMPOSANT : GALERIE COMMUNAUTAIRE ---
const CommunityGallery = ({ photos, loading, userId, onDelete }) => (
  <View style={styles.socialSection}>
    <Text style={styles.sectionTitle}>Réalisations de la Communauté</Text>
    {loading ? (
      <ActivityIndicator color={COLORS.secondary} />
    ) : photos.length === 0 ? (
      <Text style={styles.noPhotoText}>Soyez le premier à partager votre réalisation !</Text>
    ) : (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
        {photos.map((item) => (
          <View key={item.id} style={styles.galleryCard}>
            <Image source={{ uri: item.photo_url }} style={styles.galleryImage} />
            
            {/* Bouton supprimer seulement si c'est MA photo */}
            {userId === item.user_id && (
              <TouchableOpacity style={styles.deletePhotoBtn} onPress={() => onDelete(item)}>
                <Ionicons name="trash" size={16} color="#FF4444" />
              </TouchableOpacity>
            )}

            <View style={styles.galleryUserRow}>
              <Image source={{ uri: item.user_avatar || 'https://via.placeholder.com/30' }} style={styles.galleryAvatar} />
              <Text style={styles.galleryUserName}>{item.user_name || 'Gourmet Anonymous'}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    )}
  </View>
);

// --- COMPOSANT PRINCIPAL ---
const PageRecette = ({ recipe, isMobile, toggleFavorite, isFavorite, selectedCuisine, user }) => {
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
      console.log("1. Lecture du fichier via FileSystem, URI:", uri);
      
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      
      // Conversion Base64 -> Blob (le plus fiable sur Android)
      const arrayBuffer = decode(base64);
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

      console.log("2. Image convertie en Blob avec succès");
      
      const fileExt = uri.split('.').pop().split('?')[0];
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log("3. Tentative d'upload vers Supabase Storage, chemin:", filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        console.error("4. ERREUR STORAGE SUPABASE:", uploadError);
        throw new Error(uploadError.message);
      }

      console.log("5. Upload Storage réussi:", uploadData);
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      // 4. Enregistrer dans la base SQL
      const { error: dbError } = await supabase
        .from('recipe_photos')
        .insert({
          meal_id: recipe.idMeal,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email,
          user_avatar: user.user_metadata?.avatar_url,
          photo_url: publicUrl
        });

      if (dbError) throw new Error(dbError.message);

      fetchPhotos();
    } catch (err) {
      console.error("ERREUR:", err);
      Alert.alert("Erreur d'envoi", err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: contentFade, transform: [{ translateY: slideIn }] }]}>
      <RecipeHero recipe={recipe} isMobile={isMobile} selectedCuisine={selectedCuisine} toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
      <RecipeRibbon />
      <Text style={styles.title}>{recipe.name}</Text>
      <View style={styles.titleDivider} />

      <TouchableOpacity 
        style={[styles.cameraButton, uploading && { opacity: 0.5 }]} 
        onPress={handleCamera}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <>
            <Ionicons name="camera" size={20} color={COLORS.primary} />
            <Text style={styles.cameraButtonText}>PARTAGER MA RÉALISATION</Text>
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
  floatingAction: { position: 'absolute', bottom: -25, right: 32, backgroundColor: COLORS.primary, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: COLORS.secondary, elevation: 8 },
  ribbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, paddingVertical: 60 },
  ribbonItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ribbonText: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '800', letterSpacing: 2 },
  ribbonDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(212, 175, 55, 0.4)' },
  title: { fontSize: 42, fontWeight: '300', color: '#FFF', textAlign: 'center', paddingHorizontal: 24, fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif', letterSpacing: 2, marginBottom: 20 },
  titleDivider: { width: 40, height: 1, backgroundColor: COLORS.secondary, alignSelf: 'center', marginBottom: 60 },
  contentLayout: { paddingHorizontal: 32 },
  desktopRow: { flexDirection: 'row' },
  desktopCol: { flex: 1 },
  section: { marginBottom: 60 },
  sectionTitle: { fontSize: 18, fontWeight: '300', color: COLORS.secondary, letterSpacing: 4, marginBottom: 32, textTransform: 'uppercase' },
  ingredientsList: { gap: 16 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ingDot: { width: 6, height: 1, backgroundColor: COLORS.secondary },
  ingText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '400', lineHeight: 22 },
  stepBlock: { marginBottom: 40 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  stepIndex: { color: COLORS.secondary, fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  stepLine: { flex: 1, height: 0.5, backgroundColor: 'rgba(255,255,255,0.05)' },
  stepContent: { color: 'rgba(255,255,255,0.6)', lineHeight: 28, fontSize: 15, fontWeight: '400' },
  cameraButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.secondary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignSelf: 'center', marginBottom: 40, gap: 10 },
  cameraButtonText: { color: COLORS.primary, fontWeight: 'bold', letterSpacing: 1 },
  socialSection: { marginTop: 40, paddingHorizontal: 32 },
  galleryScroll: { gap: 16, paddingBottom: 20 },
  galleryCard: { width: 150, borderRadius: 12, overflow: 'hidden', backgroundColor: '#1A1A1A' },
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

