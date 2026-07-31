import { PropsWithChildren, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Link, router, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';
import { User } from '@/types';
import { FinzyText } from './ui';

type NavItem = {
  href: '/dashboard' | '/perfil' | '/admin/login';
  label: string;
  icon: string;
  section?: string;
  badge?: string;
};

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '◇', section: 'Principal' },
  { href: '/dashboard', label: 'Receitas', icon: '↓' },
  { href: '/dashboard', label: 'Gastos', icon: '↑', badge: '3' },
  { href: '/dashboard', label: 'Metas', icon: '◎' },
  { href: '/dashboard', label: 'Relatórios', icon: '≋', section: 'Análise' },
  { href: '/dashboard', label: 'Planejamento', icon: '⊞' },
  { href: '/dashboard', label: 'Configurações', icon: '⚙' },
  { href: '/perfil', label: 'Perfil', icon: '○' },
] as const;

export function AppShell({ children, user }: PropsWithChildren<{ user: User | null }>) {
  const { width } = useWindowDimensions();
  const { colors, theme, toggleTheme } = useFinzyTheme();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const compact = width < 780;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <View style={styles.shell}>
        {!compact && (
          <View style={[styles.sidebar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <FinzyText variant="logo" style={[styles.logo, { borderColor: colors.border }]}>
              finzy
            </FinzyText>
            <View style={styles.nav}>
              {navItems.map((item, index) => (
                <View key={`${item.label}-${index}`}>
                  {item.section && (
                    <FinzyText variant="label" style={[styles.navSection, { color: colors.muted2 }]}>
                      {item.section}
                    </FinzyText>
                  )}
                  <Link href={item.href as never} asChild>
                    <Pressable
                      style={[
                        styles.navItem,
                        pathname === item.href && { backgroundColor: colors.accentD, borderLeftColor: colors.accent },
                      ]}>
                      <FinzyText style={[styles.navIcon, { color: pathname === item.href ? colors.text : colors.muted }]}>
                        {item.icon}
                      </FinzyText>
                      <FinzyText style={{ color: pathname === item.href ? colors.text : colors.muted }}>{item.label}</FinzyText>
                      {item.badge && <FinzyText style={[styles.badge, { backgroundColor: colors.red }]}>{item.badge}</FinzyText>}
                    </Pressable>
                  </Link>
                </View>
              ))}
            </View>
            <Pressable onPress={toggleTheme} style={[styles.themeToggle, { borderColor: colors.border }]}>
              <FinzyText style={{ color: colors.muted }}>{theme === 'light' ? '☀ Tema claro' : '🌙 Tema escuro'}</FinzyText>
              <View style={[styles.toggleTrack, { backgroundColor: colors.surface2, borderColor: colors.borderMd }]}>
                <View
                  style={[
                    styles.toggleThumb,
                    { backgroundColor: theme === 'light' ? colors.accent : colors.muted, transform: [{ translateX: theme === 'light' ? 16 : 0 }] },
                  ]}
                />
              </View>
            </Pressable>
            <View style={styles.userPill}>
              <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                <FinzyText style={styles.avatarText}>{user?.avatar ?? 'JS'}</FinzyText>
              </View>
              <View>
                <FinzyText style={styles.userName}>{user?.name ?? 'João Silva'}</FinzyText>
                <FinzyText variant="small" style={{ color: colors.muted }}>
                  Plano {user?.plan ?? 'Gratuito'}
                </FinzyText>
              </View>
            </View>
          </View>
        )}
        <ScrollView
          style={styles.content}
          contentContainerStyle={[styles.contentInner, compact && styles.contentInnerCompact]}
          showsVerticalScrollIndicator={false}>
          {compact && (
            <View style={[styles.mobileNav, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <FinzyText variant="logo">finzy</FinzyText>
              <View style={styles.mobileLinks}>
                <Link href={'/dashboard' as never} asChild>
                  <Pressable>
                    <FinzyText style={{ color: pathname === '/dashboard' ? colors.accent : colors.muted }}>Dashboard</FinzyText>
                  </Pressable>
                </Link>
                <Link href={'/perfil' as never} asChild>
                  <Pressable>
                    <FinzyText style={{ color: pathname === '/perfil' ? colors.accent : colors.muted }}>Perfil</FinzyText>
                  </Pressable>
                </Link>
                <Pressable onPress={toggleTheme}>
                  <FinzyText>{theme === 'light' ? '☀' : '🌙'}</FinzyText>
                </Pressable>
              </View>
            </View>
          )}
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  shell: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 220,
    borderRightWidth: 1,
    paddingVertical: 28,
  },
  logo: {
    paddingHorizontal: 22,
    paddingBottom: 26,
    borderBottomWidth: 1,
  },
  nav: {
    flex: 1,
    paddingVertical: 14,
  },
  navSection: {
    paddingTop: 14,
    paddingHorizontal: 22,
    paddingBottom: 5,
  },
  navItem: {
    minHeight: 38,
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  navIcon: {
    width: 17,
    textAlign: 'center',
  },
  badge: {
    marginLeft: 'auto',
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 99,
  },
  themeToggle: {
    borderTopWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTrack: {
    width: 34,
    height: 18,
    borderWidth: 1,
    borderRadius: 99,
    padding: 2,
  },
  toggleThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  userPill: {
    paddingHorizontal: 22,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 40,
    gap: 22,
  },
  contentInnerCompact: {
    padding: 16,
    paddingBottom: 34,
  },
  mobileNav: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
