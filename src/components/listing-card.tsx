import { Link } from 'expo-router';
import { View } from 'react-native';

import { money } from '@/data/fees';
import type { Listing } from '@/data/types';
import { distanceText, liveBadge, shortName, useStore } from '@/store';
import { colors } from '@/theme';
import { HeartButton, LivePill, Photo, PressScale, Row, T, Verified } from './ui';

/**
 * A listing tile. Tapping zooms the photo into the listing page (iOS 18+);
 * long-pressing shows a preview of the page.
 */
export function ListingCard({ listing, width, featured }: { listing: Listing; width: number; featured?: boolean }) {
  const store = useStore();
  const seller = store.getSeller(listing.sellerId);
  const imageHeight = featured ? width * 1.02 : width * 1.2;
  const badge = liveBadge(listing);

  return (
    <View style={{ width }}>
      <Link href={{ pathname: '/listing/[id]', params: { id: listing.id } }} asChild>
        <Link.Trigger>
          <PressScale>
            <Link.AppleZoom>
              <View collapsable={false}>
                <Photo id={listing.photo} backdrop={listing.backdrop} width={width} height={imageHeight} radius={featured ? 22 : 18} />
              </View>
            </Link.AppleZoom>
            {badge ? <LivePill text={badge} style={{ position: 'absolute', left: 10, bottom: 10 }} /> : null}
            {listing.ships && !badge ? <LivePillQuiet text="Ships" /> : null}
          </PressScale>
        </Link.Trigger>
        <Link.Preview />
      </Link>

      <View style={{ position: 'absolute', top: 8, right: 8 }}>
        <HeartButton saved={store.isSaved(listing.id)} onToggle={() => store.toggleSave(listing.id)} />
      </View>

      <View style={{ marginTop: 10, gap: 3 }}>
        {featured ? <T variant="label" color={colors.forest}>Just listed near you</T> : null}
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
    </View>
  );
}

function LivePillQuiet({ text }: { text: string }) {
  return (
    <View style={{ position: 'absolute', left: 10, bottom: 10, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
      <T variant="small" style={{ color: colors.ink, fontSize: 12, lineHeight: 15 }}>{text}</T>
    </View>
  );
}
