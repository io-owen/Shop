import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Button, ItemImage, LineItem, Row, Rule, T } from '@/components/ui';
import { breakdown, money } from '@/data/fees';
import { shortName, statusText, useStore } from '@/store';
import { colors, hairline, space } from '@/theme';

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const order = store.getOrder(id);
  const listing = order ? store.getListing(order.listingId) : undefined;

  if (!order || !listing) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  const seller = store.getSeller(listing.sellerId);
  const status = statusText[order.status];
  const b = breakdown(listing, order.price, order.fulfilment);

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.gutter, paddingBottom: 60, gap: 24 }}>
      <Row gap={14}>
        <ItemImage icon={listing.icon} backdrop={listing.backdrop} iconSize={34} radius={14} style={{ width: 78, height: 78 }} />
        <View style={{ flex: 1, gap: 3 }}>
          <T variant="label" color={status.color}>{status.label}</T>
          <T variant="heading">{listing.title}</T>
          <T variant="small">from {shortName(seller.name)}</T>
        </View>
      </Row>

      {order.status === 'reserved' && order.fulfilment !== 'shipping' ? (
        <View style={styles.card}>
          <QRCode value={`shop-handoff:${order.code}`} size={190} color={colors.ink} backgroundColor="#fff" />
          <T variant="label" style={{ marginTop: 14 }}>{order.code}</T>
          <T variant="small" style={{ textAlign: 'center', marginTop: 6, maxWidth: 250 }}>
            Show this at {order.fulfilment === 'delivery' ? 'delivery' : 'pickup'}. {shortName(seller.name)} scans it and the payment goes through.
          </T>
        </View>
      ) : null}

      {order.status === 'completed' ? (
        <Row gap={12} style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}>
          <Feather name="check-circle" size={20} color={colors.forest} />
          <T variant="strong" style={{ flex: 1 }}>Paid {money(b.total)}. Enjoy it.</T>
        </Row>
      ) : null}

      <View style={{ gap: 12 }}>
        <T variant="label">{order.fulfilment === 'pickup' ? 'Pickup' : order.fulfilment === 'delivery' ? 'Delivery' : 'Shipping'}</T>
        <Row gap={12}>
          <Feather name="clock" size={16} color={colors.forest} />
          <T variant="body">{order.slot}</T>
        </Row>
        {order.spot ? (
          <Row gap={12}>
            <Feather name="map-pin" size={16} color={colors.forest} />
            <T variant="body">{order.spot}</T>
          </Row>
        ) : null}
      </View>

      <View style={{ gap: 12 }}>
        <T variant="label">Payment</T>
        <LineItem label={order.status === 'offer' ? 'Your offer' : 'Item'} value={money(b.price)} />
        <LineItem label="Buyer protection" value={money(b.fee)} />
        {b.extra ? <LineItem label={b.extraLabel} value={money(b.extra)} /> : null}
        <Rule />
        <LineItem label="Total" value={money(b.total)} bold />
        {order.status === 'reserved' && order.fulfilment !== 'shipping' ? (
          <LineItem label="Hold paid" value={money(b.deposit)} note={`${money(b.dueLater)} left to pay at handoff`} />
        ) : null}
      </View>

      {order.status === 'reserved' || order.status === 'offer' ? (
        <View style={{ gap: 8 }}>
          {order.status === 'reserved' ? (
            <Button title="Simulate seller scanning code" variant="secondary" icon="maximize" onPress={() => store.setOrderStatus(order.id, 'completed')} />
          ) : null}
          <Button
            title={order.status === 'offer' ? 'Withdraw offer' : 'Cancel reservation'}
            variant="danger"
            onPress={() => store.setOrderStatus(order.id, 'cancelled')}
          />
          {order.status === 'reserved' ? (
            <T variant="small" style={{ textAlign: 'center' }}>Cancel more than 2 hours before and your hold is refunded.</T>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center', padding: 22, backgroundColor: colors.surface, borderRadius: 22,
    borderWidth: hairline, borderColor: colors.lineStrong,
  },
});
