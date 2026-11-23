import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { money } from '@/data/fees';
import type { Listing } from '@/data/types';
import { distanceText, shortName, useStore } from '@/store';
import { colors } from '@/theme';
import { IconButton, ItemImage, Row, T, Verified } from './ui';

export function ListingCard({ listing, width, featured }: { listing: Listing; width: number; featured?: boolean }) {
  const store = useStore();
  const seller = store.getSeller(listing.sellerId);
  const saved = store.isSaved(listing.id);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/listing/[id]', params: { id: listing.id } })}
      style={({ pressed }) => [{ width }, pressed && { opacity: 0.85 }]}>
      <View>
        <ItemImage
          icon={listing.icon}
          backdrop={listing.backdrop}
          iconSize={featured ? 120 : 58}
          radius={featured ? 22 : 18}
          style={{ width, height: featured ? width * 0.86 : width * 1.12 }}
        />
        <View style={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton
            label={saved ? 'Remove from saved' : 'Save'}
            filled
            onPress={() => store.toggleSave(listing.id)}
            icon={<MaterialCommunityIcons name={saved ? 'heart' : 'heart-outline'} size={19} color={saved ? colors.danger : colors.ink} />}
          />
        </View>
      </View>

      <View style={{ marginTop: 10, gap: 3 }}>
        {featured ? <T variant="label" color={colors.forest}>New nearby</T> : null}
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }} gap={10}>
          <T variant={featured ? 'heading' : 'item'} numberOfLines={featured ? 2 : 1} style={{ flex: 1 }}>
            {listing.title}
          </T>
          <T variant="price" style={featured ? { fontSize: 22, lineHeight: 27 } : null}>{money(listing.price)}</T>
        </Row>
        <Row gap={4}>
          <T variant="small" numberOfLines={1}>{shortName(seller.name)}</T>
          {seller.verified ? <Verified size={12} /> : null}
          <T variant="small" numberOfLines={1} style={{ flexShrink: 1 }}>· {distanceText(listing)}</T>
        </Row>
      </View>
    </Pressable>
  );
}
