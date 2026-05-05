#include <GL/glut.h>
#include <math.h>
#include <ctime>
#include <cstdlib>

enum GameState {
    DIAMOND_FALLING,
    DIAMOND_BROKEN
};

GameState currentState = DIAMOND_FALLING;

//diamond
float diamondX = 0.0f;
float diamondY = 0.8f;  
float diamondSpeed = 0.012f;
const float diamond_size = 0.45f; 

//rectangle
const float rect_width = 1.95f;
const float rect_height = 0.30f;
const float RECT_Y = -0.85f;
int showRectangle = 1;

void drawEquilateralTriangle(float centerX, float centerY, float sideLength, int direction)
{
    float h = (sqrt(3.0f) / 2.0f) * sideLength;
    float halfSide = sideLength / 2.0f;

    glBegin(GL_TRIANGLES);
    if (direction == 1) { 
        glVertex2f(centerX, centerY + h/2.0f);
        glVertex2f(centerX - halfSide, centerY - h/2.0f);
        glVertex2f(centerX + halfSide, centerY - h/2.0f);
    } else { 
        glVertex2f(centerX, centerY - h/2.0f);
        glVertex2f(centerX - halfSide, centerY + h/2.0f);
        glVertex2f(centerX + halfSide, centerY + h/2.0f);
    }
    glEnd();
}
void drawRightTriangle(float centerX, float centerY, float size, int side)
{
    glBegin(GL_TRIANGLES);
    if (side == 1) { 
        glVertex2f(centerX - size, centerY + size); 
        glVertex2f(centerX + size, centerY + size);
        glVertex2f(centerX - size, centerY - size);
    } else { 
        glVertex2f(centerX + size, centerY + size); 
        glVertex2f(centerX - size, centerY + size);
        glVertex2f(centerX + size, centerY - size);
    }
    glEnd();
}

void drawDiamond(float x, float y, float size)
{
    glBegin(GL_QUADS);
    glColor3f(0.85f, 0.95f, 1.0f); 
    glVertex2f(x - size * 0.6f, y + size * 0.4f);
    glVertex2f(x + size * 0.6f, y + size * 0.4f);
    glColor3f(0.0f, 0.75f, 1.0f); 
    glVertex2f(x + size, y);
    glVertex2f(x - size, y);
    glEnd();

    glBegin(GL_TRIANGLES);
    glColor3f(0.0f, 0.75f, 1.0f); 
    glVertex2f(x - size, y);
    glVertex2f(x + size, y);
    glColor3f(0.0f, 0.45f, 0.85f); 
    glVertex2f(x, y - size);
    glEnd();
}

void drawBrokenParts()
{
    float topY = 0.5f;   
    float bottomY = -0.4f;
    float sideLen = 0.6f; 
    
    glColor3f(0.9f, 0.9f, 0.9f); 
    drawEquilateralTriangle(-0.6f, topY, sideLen, 1);  
    
    glColor3f(0.5f, 0.85f, 1.0f); 
    drawEquilateralTriangle(0.0f, topY, sideLen, -1);   
    
    glColor3f(0.0f, 0.7f, 1.0f); 
    drawEquilateralTriangle(0.6f, topY, sideLen, 1);   

    float rightTriangleSize = 0.40f; 
    glColor3f(0.0f, 0.6f, 0.9f);
    drawRightTriangle(-0.5f, bottomY, rightTriangleSize, 2); 
    drawRightTriangle(0.5f, bottomY, rightTriangleSize, 1);  
}

void drawRedRectangle()
{
    if (!showRectangle) return;
    glColor3f(1.0f, 0.0f, 0.0f);
    glBegin(GL_QUADS);
    glVertex2f(-rect_width/2, RECT_Y + rect_height/2);
    glVertex2f(rect_width/2, RECT_Y + rect_height/2);
    glVertex2f(rect_width/2, RECT_Y - rect_height/2);
    glVertex2f(-rect_width/2, RECT_Y - rect_height/2);
    glEnd();
}

void checkCollision()
{
    if (currentState == DIAMOND_FALLING)
    {
        if (diamondY - diamond_size <= RECT_Y + rect_height/2)
        {
            currentState = DIAMOND_BROKEN;
            showRectangle = 0;
        }
    }
}

void updateAnimation(int value)
{
    if (currentState == DIAMOND_FALLING)
    {
        diamondY -= diamondSpeed;
        checkCollision();
    }
    glutPostRedisplay();
    glutTimerFunc(16, updateAnimation, 0);
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT);
    glLoadIdentity();
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    
    drawRedRectangle();
    
    if (currentState == DIAMOND_FALLING) {
        drawDiamond(diamondX, diamondY, diamond_size); 
    } else {
        drawBrokenParts();
    }
    
    glFlush();
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);
    glutInitWindowSize(400, 500);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowPosition(300, 50);
    glutCreateWindow("Diamond - GIGANTIC EDITION");
    
    glutDisplayFunc(display);
    glutTimerFunc(16, updateAnimation, 0);
    srand(time(NULL));
    
    glutMainLoop();
    return 0;
}