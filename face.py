import pygame
import sys

# Inicializar Pygame
pygame.init()

# Configuración de la pantalla
screen_width = 400
screen_height = 300
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Robot Face Animation")

# Colores
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

# Dibujar la cara del gato
def draw_cat_face(expression):
    screen.fill(BLACK)
    
    # Cabeza del gato
    pygame.draw.rect(screen, WHITE, [100, 50, 200, 200], 0, border_radius=50)

    # Orejas
    pygame.draw.polygon(screen, BLACK, [(100, 50), (150, 50), (125, 20)])
    pygame.draw.polygon(screen, BLACK, [(300, 50), (250, 50), (275, 20)])

    # Ojos (diferentes expresiones)
    if expression == "happy":
        pygame.draw.circle(screen, BLACK, (150, 130), 30)
        pygame.draw.circle(screen, BLACK, (250, 130), 30)
        pygame.draw.circle(screen, WHITE, (160, 120), 10)
        pygame.draw.circle(screen, WHITE, (240, 120), 10)
        pygame.draw.circle(screen, WHITE, (140, 140), 8)
        pygame.draw.circle(screen, WHITE, (260, 140), 8)
    elif expression == "surprised":
        pygame.draw.circle(screen, BLACK, (150, 130), 40, 5)
        pygame.draw.circle(screen, BLACK, (250, 130), 40, 5)
        pygame.draw.circle(screen, WHITE, (150, 130), 30)
        pygame.draw.circle(screen, WHITE, (250, 130), 30)
    # Más expresiones pueden añadirse aquí...

    # Boca
    if expression == "happy":
        pygame.draw.arc(screen, BLACK, (150, 160, 100, 50), 3.14, 0, 5)
    elif expression == "surprised":
        pygame.draw.ellipse(screen, BLACK, (175, 170, 50, 30), 5)
    
    # Bigotes
    pygame.draw.line(screen, BLACK, (120, 170), (80, 180), 3)
    pygame.draw.line(screen, BLACK, (120, 190), (80, 190), 3)
    pygame.draw.line(screen, BLACK, (120, 210), (80, 200), 3)
    pygame.draw.line(screen, BLACK, (280, 170), (320, 180), 3)
    pygame.draw.line(screen, BLACK, (280, 190), (320, 190), 3)
    pygame.draw.line(screen, BLACK, (280, 210), (320, 200), 3)

    pygame.display.flip()

# Bucle principal
def main():
    clock = pygame.time.Clock()
    expressions = ["happy", "surprised"]  # Lista de expresiones
    current_expression = 0
    change_expression_event = pygame.USEREVENT + 1
    pygame.time.set_timer(change_expression_event, 2000)  # Cambia cada 2 segundos

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == change_expression_event:
                current_expression = (current_expression + 1) % len(expressions)
        
        draw_cat_face(expressions[current_expression])
        clock.tick(30)  # 30 FPS

if __name__ == "__main__":
    main()
